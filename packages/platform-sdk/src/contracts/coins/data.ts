import { BigNumber } from "@arkecosystem/utils";

import { KeyValuePair } from "../types";

export interface TransactionData {
	getId(): string;

	getType(): number | undefined;

	getTypeGroup(): number | undefined;

	getTimestamp(): number | undefined;

	getConfirmations(): BigNumber;

	getNonce(): string | undefined;

	getSender(): string;

	getRecipient(): string;

	getAmount(): BigNumber;

	getFee(): BigNumber;

	getVendorField(): string | undefined;

	getBlockId(): string;

	toObject(): KeyValuePair;
}

export interface WalletData {
	getAddress(): string;

	getPublicKey(): string | undefined;

	getBalance(): BigNumber;

	getNonce(): BigNumber;

	toObject(): KeyValuePair;
}

export interface DelegateData {
	getAddress(): string;

	getPublicKey(): string;

	getUsername(): string;

	getRank(): number;

	toObject(): KeyValuePair;
}

export interface PeerData {
	getIp(): string;

	getPort(): number;

	getVersion(): string;

	getHeight(): number;

	getLatency(): number;

	toObject(): KeyValuePair;
}