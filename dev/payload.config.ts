import path from "node:path";
import { fileURLToPath } from "node:url";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { buildConfig } from "payload";
import { createBlockConfig, payloadShikiCode } from "payload-shiki-code";
import sharp from "sharp";

import { testEmailAdapter } from "./helpers/testEmailAdapter.js";
import { seed } from "./seed.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname;
}

const buildConfigWithMemoryDB = async () => {
  if (process.env.CI === "true") {
    const memoryDB = await MongoMemoryReplSet.create({
      replSet: {
        count: 3,
        dbName: "payloadmemory",
      },
    });
    await memoryDB.waitUntilRunning();

    process.env.DATABASE_URI = `${memoryDB.getUri()}&retryWrites=true`;
  }

  return buildConfig({
    admin: {
      importMap: {
        baseDir: path.resolve(dirname),
      },
    },
    collections: [
      {
        slug: "posts",
        fields: [
          {
            type: "richText",
            name: "content",
            editor: lexicalEditor({
              features: ({ defaultFeatures }) => [
                ...defaultFeatures,
                BlocksFeature({
                  blocks: [createBlockConfig()],
                }),
              ],
            }),
          },
        ],
      },
      {
        slug: "media",
        fields: [],
        upload: {
          staticDir: path.resolve(dirname, "media"),
        },
      },
    ],
    db: mongooseAdapter({
      ensureIndexes: true,
      url:
        process.env.DATABASE_URI ||
        "mongodb://127.0.0.1:27017/payload-shiki-code-test",
    }),
    //// config as global
    // editor: lexicalEditor({
    //   features: ({ defaultFeatures }) => [
    //     ...defaultFeatures,
    //     BlocksFeature({
    //       blocks: [createBlockConfig()],
    //     }),
    //   ],
    // }),
    email: testEmailAdapter,
    onInit: async (payload) => {
      await seed(payload);
    },
    plugins: [
      payloadShikiCode({
        languages: [
          "rust",
          "typescript",
          "javascript",
          "html",
          "css",
          "lua",
          "dart",
          "ts", // will be normalized
        ],
        shiki: {
          themes: {
            light: "github-light",
            dark: "everforest-dark",
          },
        },
      }),
    ],
    secret: process.env.PAYLOAD_SECRET || "test-secret_key",
    sharp,
    typescript: {
      outputFile: path.resolve(dirname, "payload-types.ts"),
    },
  });
};

export default buildConfigWithMemoryDB();
