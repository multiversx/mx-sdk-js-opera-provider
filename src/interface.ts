import type {Message} from "@multiversx/sdk-core/out/message";

export interface ISignature {
  hex(): string;
}

export interface IAddress {
  bech32(): string;
}

export interface ITransaction {
  toPlainObject(): any;
  applySignature(signature: ISignature, signedBy: IAddress): void;
}

export interface IMessage {
  data: Uint8Array;
  signature?: Uint8Array;
}

export interface IProviderAccount {
  address: string;
  name?: string;
  signature?: string;
}

export interface MultiversxOperaProvider {
  account: IProviderAccount;
  /*static getInstance(): Elrond | undefined */
  init(): Promise<boolean>;
  login?(options?: {token?: string}): Promise<IProviderAccount | null>;
  logout(): Promise<boolean>;
  getAddress(): Promise<string>;
  getAccount(): IProviderAccount | null;
  setAccount(account: IProviderAccount): void;
  isInitialized(): boolean;
  isConnected?(): boolean;
  signTransaction<T extends ITransaction>(transaction: T): Promise<T>;
  signTransactions<T extends ITransaction>(transactions: T[]): Promise<T[]>;
  signMessage<T extends Message>(message: T): Promise<T>;
}
