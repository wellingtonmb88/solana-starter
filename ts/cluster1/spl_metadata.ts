import wallet from "../turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("7kDzn1uCFeMEDVAU8aPd3h3ENHhEQsAEsroK6g4cEWyr");

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint,
      mintAuthority: signer,
    };

    let data: DataV2Args = {
      name: "Turb1n3 Masterpiece #1 (Devnet)",
      symbol: "TMP1",
      collection: null,
      creators: null,
      sellerFeeBasisPoints: 0,
      uri: "",
      uses: null,
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      data,
      collectionDetails: null,
      isMutable: true,
    };

    let tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args,
    });
    let result = await tx.sendAndConfirm(umi);

    console.log(`NFT is created at : ${bs58.encode(result.signature)}`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
