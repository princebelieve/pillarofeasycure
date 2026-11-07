//server/src/config/r2.js
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { randomUUID } = require("crypto");

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

async function uploadToR2(file, folder = "general") {
  const cleanName = file.originalname.replace(/\s+/g, "-");

  const key = `${folder}/${Date.now()}-${cleanName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${process.env.R2_PUBLIC_BASE_URL}/${key}`;
}

async function uploadBufferToR2(buffer, { fileName = "upload", contentType = "application/octet-stream", folder = "general" } = {}) {
  const key = `${folder}/${Date.now()}-${safeFileName(fileName)}`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }));
  return `${process.env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
}

function createSourceR2Client() {
  const { EASYLIFE_SOURCE_R2_ENDPOINT, EASYLIFE_SOURCE_R2_ACCESS_KEY, EASYLIFE_SOURCE_R2_SECRET_KEY } = process.env;
  if (!EASYLIFE_SOURCE_R2_ENDPOINT || !EASYLIFE_SOURCE_R2_ACCESS_KEY || !EASYLIFE_SOURCE_R2_SECRET_KEY || !process.env.EASYLIFE_SOURCE_R2_BUCKET) {
    throw new Error("Configure the EasyLife source R2 endpoint, access key, secret key, and bucket on the server.");
  }
  return new S3Client({
    region: "auto",
    endpoint: EASYLIFE_SOURCE_R2_ENDPOINT,
    credentials: { accessKeyId: EASYLIFE_SOURCE_R2_ACCESS_KEY, secretAccessKey: EASYLIFE_SOURCE_R2_SECRET_KEY },
  });
}

async function readSourceR2Object(sourceS3, key) {
  const result = await sourceS3.send(new GetObjectCommand({ Bucket: process.env.EASYLIFE_SOURCE_R2_BUCKET, Key: key }));
  const chunks = [];
  for await (const chunk of result.Body) chunks.push(Buffer.from(chunk));
  return { buffer: Buffer.concat(chunks), contentType: result.ContentType || "application/octet-stream" };
}

function safeFileName(fileName = "upload") {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(0, 120) || "upload";
}

async function createPresignedContentUpload({ mediaType, fileName, contentType }) {
  const mediaFolders = { image: "testimonials/images", video: "testimonials/videos", audio: "testimonials/audio" };
  const folder = mediaFolders[mediaType];
  if (!folder || !contentType?.toLowerCase().startsWith(`${mediaType}/`)) {
    throw new Error("The selected file type does not match the requested media type.");
  }

  const key = `${folder}/${randomUUID()}-${safeFileName(fileName)}`;
  const cacheControl = "public, max-age=31536000, immutable";
  const command = new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, ContentType: contentType, CacheControl: cacheControl });
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 10 * 60 });
  return { uploadUrl, publicUrl: `${process.env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`, uploadHeaders: { "Cache-Control": cacheControl } };
}

function getR2KeyFromPublicUrl(fileUrl) {
  if (!fileUrl || !process.env.R2_PUBLIC_BASE_URL) return null;

  try {
    const publicBase = new URL(process.env.R2_PUBLIC_BASE_URL);
    const fileLocation = new URL(fileUrl);
    const basePath = publicBase.pathname.replace(/\/$/, "");
    const expectedPrefix = `${basePath}/`;

    if (
      fileLocation.origin !== publicBase.origin ||
      !fileLocation.pathname.startsWith(expectedPrefix)
    ) {
      return null;
    }

    return decodeURIComponent(fileLocation.pathname.slice(expectedPrefix.length));
  } catch {
    return null;
  }
}

async function deleteFromR2(fileUrl) {
  const key = getR2KeyFromPublicUrl(fileUrl);
  if (!key) return false;

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
    }),
  );

  return true;
}

module.exports = { uploadToR2, uploadBufferToR2, createSourceR2Client, readSourceR2Object, createPresignedContentUpload, deleteFromR2 };
