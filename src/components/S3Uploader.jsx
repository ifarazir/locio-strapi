import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

export default async function S3Uploader(voice) {
  // S3 Bucket Name
  console.log(voice);

  const client = new S3Client({
    region: "default",
    endpoint: 'https://s3.ir-thr-at1.arvanstorage.ir',
    credentials: {
      accessKeyId: "2314aa4b-99d2-49cb-b11a-0a95aaf4bd53",
      secretAccessKey: "519ce85a8d7b277f0dbd428640d783f54051738df506ab06c55cec70767fe838",
    },
  });

  const params = {
    Bucket: "locio-voices",
    Key: nanoid() + '.webm',
    Body: voice,
  };

  const command = new PutObjectCommand(params);
  const data = await client.send(command);
  console.log(data);


}