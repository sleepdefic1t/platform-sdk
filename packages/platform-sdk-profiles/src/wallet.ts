import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

import { Avatar } from "./avatar";
import { container } from "./container";
import { Identifiers, WalletStruct } from "./contracts";
import { WalletSetting } from "./enums";
import { DataRepository } from "./repositories/data-repository";
import { SettingRepository } from "./repositories/setting-repository";

export class Wallet {
	#dataRepository!: DataRepository;
	#settingRepository!: SettingRepository;

	#coin!: Coins.Coin;
	#wallet!: Contracts.WalletData;
	#avatar!: string;

	public constructor() {
		this.#dataRepository = new DataRepository();
		this.#settingRepository = new SettingRepository(Object.values(WalletSetting));
	}

	/**
	 * These methods allow to switch out the underlying implementation of certain things like the coin.
	 */

	public async setCoin(coin: Coins.CoinSpec, network: string): Promise<Wallet> {
		this.#coin = await Coins.CoinFactory.make(coin, {
			network,
			httpClient: container.get(Identifiers.HttpClient),
		});

		return this;
	}

	public async setIdentity(mnemonic: string): Promise<Wallet> {
		return this.setAddress(await this.#coin.identity().address().fromMnemonic(mnemonic));
	}

	public async setAddress(address: string): Promise<Wallet> {
		this.#wallet = await this.#coin.client().wallet(address);

		this.setAvatar(Avatar.make(this.address()));

		return this;
	}

	public setAvatar(value: string): Wallet {
		this.#avatar = value;

		this.settings().set(WalletSetting.Avatar, value);

		return this;
	}

	/**
	 * These methods serve as getters to the underlying data and dependencies.
	 */

	public coin(): Coins.Coin {
		return this.#coin;
	}

	public network(): string {
		return this.#coin.network().id;
	}

	public avatar(): string {
		// TODO: get either the setting or default avatar
		return this.#avatar;
	}

	public address(): string {
		return this.#wallet.address();
	}

	public publicKey(): string | undefined {
		return this.#wallet.publicKey();
	}

	public balance(): BigNumber {
		return this.#wallet.balance();
	}

	public nonce(): BigNumber {
		return this.#wallet.nonce();
	}

	public data(): DataRepository {
		return this.#dataRepository;
	}

	public settings(): SettingRepository {
		return this.#settingRepository;
	}

	public toObject(): WalletStruct {
		const coinConfig: any = { ...this.coin().config().all() };
		delete coinConfig.httpClient;

		return {
			coin: this.coin().manifest().get<string>("name"),
			coinConfig,
			network: this.network(),
			address: this.address(),
			publicKey: this.publicKey(),
			data: this.data().all(),
			settings: this.settings().all(),
		};
	}

	/**
	 * All methods below this line are convenience methods that serve as proxies to the underlying coin implementation.
	 *
	 * The purpose of these methods is to reduce duplication and prevent consumers from implementing
	 * convoluted custom implementations that deviate from how things should be used.
	 *
	 * Any changes in how things need to be handled by consumers should be made in this package!
	 */

	public transactions(): Promise<Contracts.CollectionResponse<Coins.TransactionDataCollection>> {
		return this.#coin.client().transactions({ address: this.address() });
	}

	public sentTransactions(): Promise<Contracts.CollectionResponse<Coins.TransactionDataCollection>> {
		return this.#coin.client().transactions({ senderId: this.address() });
	}

	public receivedTransactions(): Promise<Contracts.CollectionResponse<Coins.TransactionDataCollection>> {
		return this.#coin.client().transactions({ recipientId: this.address() });
	}
}
