import { client } from "@/app/lib/db";
import { AXL_CHAINS, TOKEN_ABI } from "@/constants";
import { ethers } from "ethers";
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import {Web3} from "web3"

export async function POST(req: NextRequest, res: NextApiResponse): Promise<NextResponse>  {
  
    const token = await client.get("address") as string;
    const sourceChain = await client.get("sourceChain") as string;
    const destChain = await client.get("destChain") as string;
    const amount = await client.get("amount") as number;
    const recipient = await client.get("recipient")

    const web3 = new Web3("https://base.meowrpc.com")
    const contract = new web3.eth.Contract(TOKEN_ABI, token)
    const encodedData = contract.methods.interchainTransfer(destChain,recipient, ethers.parseEther(amount.toString()),"0x0000000000000000000000000000000000000000").encodeABI()

    const txData = {
        chainId: `eip155:${AXL_CHAINS[sourceChain.trim().toLowerCase()].id}`,
        method: 'eth_sendTransaction',
        params: {
        abi: TOKEN_ABI, 
        to: token,
        data: encodedData,
        value: "200000000000000",
        },
    }
    return NextResponse.json(txData)
  }



  