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

export interface ISignableMessage {
  message: Buffer;
  applySignature(signature: ISignature, signedBy: IAddress): void;
}

export interface IOperaWalletAccount {
  address: string;
  name?: string;
  signature?: string;
}

export interface MultiversxOperaProvider {
  account: IOperaWalletAccount;
  /*static getInstance(): Elrond | undefined */
  init(): Promise<boolean>;
  login(token?: string): Promise<string>;
  logout(): Promise<boolean>;
  getAddress(): Promise<string>;
  isInitialized(): boolean;
  isConnected(): boolean;
  signTransaction<T extends ITransaction>(transaction: T): Promise<T>;
  signTransactions<T extends ITransaction>(transactions: T[]): Promise<T[]>;
  signMessage<T extends ISignableMessage>(message: T): Promise<T>;
}
