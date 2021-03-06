import { Contracts, DTO, Exceptions } from "@arkecosystem/platform-sdk";

export class DelegateData extends DTO.AbstractDelegateData implements Contracts.DelegateData {
	public address(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, "address");
	}

	public publicKey(): string {
		return this.data.validation_public_key;
	}

	public username(): string {
		throw new Exceptions.NotImplemented(this.constructor.name, "username");
	}

	public rank(): number {
		throw new Exceptions.NotImplemented(this.constructor.name, "rank");
	}
}
