import wallet from "../turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

    const image =
      "https://gateway.irys.xyz/Eh9Sx7dxn6BsgYCH57DaepuJujFzbGyeuTqNk7eUdiDK";
    const metadata = {
      name: "My Fucking Rug Pull NFT",
      symbol: "MYRUG",
      description: "This is a rug pull NFT example for educational purposes.",
      image,
      attributes: [{ trait_type: "rugpull", value: "8" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
      creators: [],
    };
    const myUri = await umi.uploader.uploadJson(metadata);

    // Your metadata URI:  https://gateway.irys.xyz/ALLapzxbQeKuD6e9H5Erp7UCfdkLqHBKHB9BkgvAt6ao
    console.log("Your metadata URI: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
