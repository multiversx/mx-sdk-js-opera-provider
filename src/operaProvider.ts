import {
  IOperaWalletAccount,
  ISignableMessage,
  ITransaction,
  MultiversxOperaProvider,
} from "./interface";
import { Address, Signature } from "./primitives";
import { Operation } from "./operation";
import {
  ErrAccountNotConnected,
  ErrCannotSignSingleTransaction,
} from "./errors";

declare global {
  interface Window {
    elrond: MultiversxOperaProvider;
    isOpera: boolean;
  }
}

export class OperaProvider {
  public account: IOperaWalletAccount = { address: "" };
  private initialized: boolean = false;
  private static _instance: OperaProvider = new OperaProvider();

  private constructor() {
    if (OperaProvider._instance) {
      throw new Error(
        "Error: Instantiation failed: Use OperaProvider.getInstance() instead of new."
      );
    }
    OperaProvider._instance = this;
  }

  public static getInstance(): OperaProvider {
    return OperaProvider._instance;
  }

  public setAddress(address: string): OperaProvider {
    this.account.address = address;
    return OperaProvider._instance;
  }

  async init(): Promise<boolean> {
    if (window && window.elrond && window.isOpera && !this.initialized) {
      try {
        this.initialized = await window.elrond.init();
      } catch (error) {
        this.initialized = false;
      }
    }
    return this.initialized;
  }

  async login({
    token,
  }: {
    callbackUrl?: string;
    token?: string;
  } = {}): Promise<string> {
    if (!this.initialized) {
      throw new Error("Opera provider is not initialised, call init() first");
    }
    try {
      this.account.address = await window.elrond.login(token);
    } catch (error: any) {
      throw error;
    }
    return this.account.address;
  }

  async logout(): Promise<boolean> {
    if (!this.initialized) {
      throw new Error("Opera provider is not initialised, call init() first");
    }
    try {
      await window.elrond.logout();
      this.disconnect();
    } catch (error) {
      console.warn("Opera logout operation failed!", error);
    }

    return true;
  }

  private disconnect() {
    this.account = { address: "" };
  }

  async getAddress(): Promise<string> {
    if (!this.initialized) {
      throw new Error("Opera provider is not initialised, call init() first");
    }
    return this.account ? this.account.address : "";
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  isConnected(): boolean {
    return Boolean(this.account.address);
  }

  async signTransaction<T extends ITransaction>(transaction: T): Promise<T> {
    const signedTransactions = await this.signTransactions([transaction]);

    if (signedTransactions.length != 1) {
      throw new ErrCannotSignSingleTransaction();
    }

    return signedTransactions[0];
  }

  async signTransactions<T extends ITransaction>(
    transactions: T[]
  ): Promise<T[]> {
    try {
      this.ensureConnected();
      return await window.elrond.signTransactions(transactions);
    } catch (error) {
      throw error;
    }
  }

  async signMessage<T extends ISignableMessage>(message: T): Promise<T> {
    try {
      this.ensureConnected();
      return await window.elrond.signMessage(message);
    } catch (error) {
      throw error;
    }
  }

  cancelAction() {
    //opera does not have a cancel action method implemented
    return false;
  }

  private ensureConnected() {
    if (!this.account.address) {
      throw new ErrAccountNotConnected();
    }
  }
}
