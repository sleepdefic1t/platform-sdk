import { Contracts, Exceptions } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/utils";

export class Transaction implements Contracts.Transaction {
	readonly #data: Contracts.KeyValuePair;

	public constructor(data: Contracts.KeyValuePair) {
		this.#data = data;
	}

	public getId(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, "getId");
	}

	public getType(): number | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, "getType");
	}

	public getTypeGroup(): number | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, "getTypeGroup");
	}

	public getTimestamp(): number | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, "getTimestamp");
	}

	public getConfirmations(): BigNumber {
		throw new Exceptions.NotImplemented(this.constructor.name, "getConfirmations");
	}

	public getNonce(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, "getNonce");
	}

	public getSender(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, "getSender");
	}

	public getRecipient(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, "getRecipient");
	}

	public getAmount(): BigNumber {
		throw new Exceptions.NotImplemented(this.constructor.name, "getAmount");
	}

	public getFee(): BigNumber {
		throw new Exceptions.NotImplemented(this.constructor.name, "getFee");
	}

	public getVendorField(): string | undefined {
		throw new Exceptions.NotImplemented(this.constructor.name, "getVendorField");
	}

	public getBlockId(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, "getBlockId");
	}

	/**
	 * Only use this function if you can ensure that the unnormalised data is handled!
	 */
	public toObject(): Contracts.KeyValuePair {
		return this.#data;
	}
}