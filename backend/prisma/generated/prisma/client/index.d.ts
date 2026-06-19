
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model Feedback
 * 
 */
export type Feedback = $Result.DefaultSelection<Prisma.$FeedbackPayload>
/**
 * Model RoleChangeAudit
 * 
 */
export type RoleChangeAudit = $Result.DefaultSelection<Prisma.$RoleChangeAuditPayload>
/**
 * Model PasswordResetCode
 * 
 */
export type PasswordResetCode = $Result.DefaultSelection<Prisma.$PasswordResetCodePayload>
/**
 * Model PurchasingLookup
 * * User-added item categories and units of measure for purchasing forms.
 */
export type PurchasingLookup = $Result.DefaultSelection<Prisma.$PurchasingLookupPayload>
/**
 * Model SupplierTypeAssignment
 * 
 */
export type SupplierTypeAssignment = $Result.DefaultSelection<Prisma.$SupplierTypeAssignmentPayload>
/**
 * Model PurchaseRequestRecord
 * 
 */
export type PurchaseRequestRecord = $Result.DefaultSelection<Prisma.$PurchaseRequestRecordPayload>
/**
 * Model PurchaseOrderRecord
 * 
 */
export type PurchaseOrderRecord = $Result.DefaultSelection<Prisma.$PurchaseOrderRecordPayload>
/**
 * Model SupplierOrderAcknowledgementRecord
 * 
 */
export type SupplierOrderAcknowledgementRecord = $Result.DefaultSelection<Prisma.$SupplierOrderAcknowledgementRecordPayload>
/**
 * Model SupplierDeliveryRecordStore
 * 
 */
export type SupplierDeliveryRecordStore = $Result.DefaultSelection<Prisma.$SupplierDeliveryRecordStorePayload>
/**
 * Model SupplierGrnRecordStore
 * 
 */
export type SupplierGrnRecordStore = $Result.DefaultSelection<Prisma.$SupplierGrnRecordStorePayload>
/**
 * Model ChatSession
 * 
 */
export type ChatSession = $Result.DefaultSelection<Prisma.$ChatSessionPayload>
/**
 * Model ChatMessage
 * 
 */
export type ChatMessage = $Result.DefaultSelection<Prisma.$ChatMessagePayload>
/**
 * Model Source
 * 
 */
export type Source = $Result.DefaultSelection<Prisma.$SourcePayload>
/**
 * Model SourceChunk
 * 
 */
export type SourceChunk = $Result.DefaultSelection<Prisma.$SourceChunkPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Language: {
  en: 'en',
  zh: 'zh',
  ms: 'ms'
};

export type Language = (typeof Language)[keyof typeof Language]

}

export type Language = $Enums.Language

export const Language: typeof $Enums.Language

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.feedback`: Exposes CRUD operations for the **Feedback** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Feedbacks
    * const feedbacks = await prisma.feedback.findMany()
    * ```
    */
  get feedback(): Prisma.FeedbackDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roleChangeAudit`: Exposes CRUD operations for the **RoleChangeAudit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoleChangeAudits
    * const roleChangeAudits = await prisma.roleChangeAudit.findMany()
    * ```
    */
  get roleChangeAudit(): Prisma.RoleChangeAuditDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passwordResetCode`: Exposes CRUD operations for the **PasswordResetCode** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordResetCodes
    * const passwordResetCodes = await prisma.passwordResetCode.findMany()
    * ```
    */
  get passwordResetCode(): Prisma.PasswordResetCodeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.purchasingLookup`: Exposes CRUD operations for the **PurchasingLookup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PurchasingLookups
    * const purchasingLookups = await prisma.purchasingLookup.findMany()
    * ```
    */
  get purchasingLookup(): Prisma.PurchasingLookupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.supplierTypeAssignment`: Exposes CRUD operations for the **SupplierTypeAssignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SupplierTypeAssignments
    * const supplierTypeAssignments = await prisma.supplierTypeAssignment.findMany()
    * ```
    */
  get supplierTypeAssignment(): Prisma.SupplierTypeAssignmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.purchaseRequestRecord`: Exposes CRUD operations for the **PurchaseRequestRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PurchaseRequestRecords
    * const purchaseRequestRecords = await prisma.purchaseRequestRecord.findMany()
    * ```
    */
  get purchaseRequestRecord(): Prisma.PurchaseRequestRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.purchaseOrderRecord`: Exposes CRUD operations for the **PurchaseOrderRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PurchaseOrderRecords
    * const purchaseOrderRecords = await prisma.purchaseOrderRecord.findMany()
    * ```
    */
  get purchaseOrderRecord(): Prisma.PurchaseOrderRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.supplierOrderAcknowledgementRecord`: Exposes CRUD operations for the **SupplierOrderAcknowledgementRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SupplierOrderAcknowledgementRecords
    * const supplierOrderAcknowledgementRecords = await prisma.supplierOrderAcknowledgementRecord.findMany()
    * ```
    */
  get supplierOrderAcknowledgementRecord(): Prisma.SupplierOrderAcknowledgementRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.supplierDeliveryRecordStore`: Exposes CRUD operations for the **SupplierDeliveryRecordStore** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SupplierDeliveryRecordStores
    * const supplierDeliveryRecordStores = await prisma.supplierDeliveryRecordStore.findMany()
    * ```
    */
  get supplierDeliveryRecordStore(): Prisma.SupplierDeliveryRecordStoreDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.supplierGrnRecordStore`: Exposes CRUD operations for the **SupplierGrnRecordStore** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SupplierGrnRecordStores
    * const supplierGrnRecordStores = await prisma.supplierGrnRecordStore.findMany()
    * ```
    */
  get supplierGrnRecordStore(): Prisma.SupplierGrnRecordStoreDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatSession`: Exposes CRUD operations for the **ChatSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatSessions
    * const chatSessions = await prisma.chatSession.findMany()
    * ```
    */
  get chatSession(): Prisma.ChatSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessages
    * const chatMessages = await prisma.chatMessage.findMany()
    * ```
    */
  get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.source`: Exposes CRUD operations for the **Source** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sources
    * const sources = await prisma.source.findMany()
    * ```
    */
  get source(): Prisma.SourceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.sourceChunk`: Exposes CRUD operations for the **SourceChunk** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SourceChunks
    * const sourceChunks = await prisma.sourceChunk.findMany()
    * ```
    */
  get sourceChunk(): Prisma.SourceChunkDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.0.0
   * Query Engine version: 0c19ccc313cf9911a90d99d2ac2eb0280c76c513
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Notification: 'Notification',
    Feedback: 'Feedback',
    RoleChangeAudit: 'RoleChangeAudit',
    PasswordResetCode: 'PasswordResetCode',
    PurchasingLookup: 'PurchasingLookup',
    SupplierTypeAssignment: 'SupplierTypeAssignment',
    PurchaseRequestRecord: 'PurchaseRequestRecord',
    PurchaseOrderRecord: 'PurchaseOrderRecord',
    SupplierOrderAcknowledgementRecord: 'SupplierOrderAcknowledgementRecord',
    SupplierDeliveryRecordStore: 'SupplierDeliveryRecordStore',
    SupplierGrnRecordStore: 'SupplierGrnRecordStore',
    ChatSession: 'ChatSession',
    ChatMessage: 'ChatMessage',
    Source: 'Source',
    SourceChunk: 'SourceChunk'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "notification" | "feedback" | "roleChangeAudit" | "passwordResetCode" | "purchasingLookup" | "supplierTypeAssignment" | "purchaseRequestRecord" | "purchaseOrderRecord" | "supplierOrderAcknowledgementRecord" | "supplierDeliveryRecordStore" | "supplierGrnRecordStore" | "chatSession" | "chatMessage" | "source" | "sourceChunk"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      Feedback: {
        payload: Prisma.$FeedbackPayload<ExtArgs>
        fields: Prisma.FeedbackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FeedbackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FeedbackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          findFirst: {
            args: Prisma.FeedbackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FeedbackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          findMany: {
            args: Prisma.FeedbackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          create: {
            args: Prisma.FeedbackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          createMany: {
            args: Prisma.FeedbackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FeedbackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          delete: {
            args: Prisma.FeedbackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          update: {
            args: Prisma.FeedbackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          deleteMany: {
            args: Prisma.FeedbackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FeedbackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FeedbackUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>[]
          }
          upsert: {
            args: Prisma.FeedbackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeedbackPayload>
          }
          aggregate: {
            args: Prisma.FeedbackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeedback>
          }
          groupBy: {
            args: Prisma.FeedbackGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeedbackGroupByOutputType>[]
          }
          count: {
            args: Prisma.FeedbackCountArgs<ExtArgs>
            result: $Utils.Optional<FeedbackCountAggregateOutputType> | number
          }
        }
      }
      RoleChangeAudit: {
        payload: Prisma.$RoleChangeAuditPayload<ExtArgs>
        fields: Prisma.RoleChangeAuditFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleChangeAuditFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleChangeAuditPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleChangeAuditFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleChangeAuditPayload>
          }
          findFirst: {
            args: Prisma.RoleChangeAuditFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleChangeAuditPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleChangeAuditFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleChangeAuditPayload>
          }
          findMany: {
            args: Prisma.RoleChangeAuditFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleChangeAuditPayload>[]
          }
          create: {
            args: Prisma.RoleChangeAuditCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleChangeAuditPayload>
          }
          createMany: {
            args: Prisma.RoleChangeAuditCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleChangeAuditCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleChangeAuditPayload>[]
          }
          delete: {
            args: Prisma.RoleChangeAuditDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleChangeAuditPayload>
          }
          update: {
            args: Prisma.RoleChangeAuditUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleChangeAuditPayload>
          }
          deleteMany: {
            args: Prisma.RoleChangeAuditDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleChangeAuditUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleChangeAuditUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleChangeAuditPayload>[]
          }
          upsert: {
            args: Prisma.RoleChangeAuditUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleChangeAuditPayload>
          }
          aggregate: {
            args: Prisma.RoleChangeAuditAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoleChangeAudit>
          }
          groupBy: {
            args: Prisma.RoleChangeAuditGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleChangeAuditGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleChangeAuditCountArgs<ExtArgs>
            result: $Utils.Optional<RoleChangeAuditCountAggregateOutputType> | number
          }
        }
      }
      PasswordResetCode: {
        payload: Prisma.$PasswordResetCodePayload<ExtArgs>
        fields: Prisma.PasswordResetCodeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordResetCodeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordResetCodeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>
          }
          findFirst: {
            args: Prisma.PasswordResetCodeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordResetCodeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>
          }
          findMany: {
            args: Prisma.PasswordResetCodeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>[]
          }
          create: {
            args: Prisma.PasswordResetCodeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>
          }
          createMany: {
            args: Prisma.PasswordResetCodeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasswordResetCodeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>[]
          }
          delete: {
            args: Prisma.PasswordResetCodeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>
          }
          update: {
            args: Prisma.PasswordResetCodeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>
          }
          deleteMany: {
            args: Prisma.PasswordResetCodeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordResetCodeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PasswordResetCodeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>[]
          }
          upsert: {
            args: Prisma.PasswordResetCodeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetCodePayload>
          }
          aggregate: {
            args: Prisma.PasswordResetCodeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordResetCode>
          }
          groupBy: {
            args: Prisma.PasswordResetCodeGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetCodeGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasswordResetCodeCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetCodeCountAggregateOutputType> | number
          }
        }
      }
      PurchasingLookup: {
        payload: Prisma.$PurchasingLookupPayload<ExtArgs>
        fields: Prisma.PurchasingLookupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchasingLookupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasingLookupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchasingLookupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasingLookupPayload>
          }
          findFirst: {
            args: Prisma.PurchasingLookupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasingLookupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchasingLookupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasingLookupPayload>
          }
          findMany: {
            args: Prisma.PurchasingLookupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasingLookupPayload>[]
          }
          create: {
            args: Prisma.PurchasingLookupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasingLookupPayload>
          }
          createMany: {
            args: Prisma.PurchasingLookupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PurchasingLookupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasingLookupPayload>[]
          }
          delete: {
            args: Prisma.PurchasingLookupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasingLookupPayload>
          }
          update: {
            args: Prisma.PurchasingLookupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasingLookupPayload>
          }
          deleteMany: {
            args: Prisma.PurchasingLookupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchasingLookupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PurchasingLookupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasingLookupPayload>[]
          }
          upsert: {
            args: Prisma.PurchasingLookupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchasingLookupPayload>
          }
          aggregate: {
            args: Prisma.PurchasingLookupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchasingLookup>
          }
          groupBy: {
            args: Prisma.PurchasingLookupGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchasingLookupGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchasingLookupCountArgs<ExtArgs>
            result: $Utils.Optional<PurchasingLookupCountAggregateOutputType> | number
          }
        }
      }
      SupplierTypeAssignment: {
        payload: Prisma.$SupplierTypeAssignmentPayload<ExtArgs>
        fields: Prisma.SupplierTypeAssignmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupplierTypeAssignmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierTypeAssignmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupplierTypeAssignmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierTypeAssignmentPayload>
          }
          findFirst: {
            args: Prisma.SupplierTypeAssignmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierTypeAssignmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupplierTypeAssignmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierTypeAssignmentPayload>
          }
          findMany: {
            args: Prisma.SupplierTypeAssignmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierTypeAssignmentPayload>[]
          }
          create: {
            args: Prisma.SupplierTypeAssignmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierTypeAssignmentPayload>
          }
          createMany: {
            args: Prisma.SupplierTypeAssignmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SupplierTypeAssignmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierTypeAssignmentPayload>[]
          }
          delete: {
            args: Prisma.SupplierTypeAssignmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierTypeAssignmentPayload>
          }
          update: {
            args: Prisma.SupplierTypeAssignmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierTypeAssignmentPayload>
          }
          deleteMany: {
            args: Prisma.SupplierTypeAssignmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupplierTypeAssignmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SupplierTypeAssignmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierTypeAssignmentPayload>[]
          }
          upsert: {
            args: Prisma.SupplierTypeAssignmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierTypeAssignmentPayload>
          }
          aggregate: {
            args: Prisma.SupplierTypeAssignmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupplierTypeAssignment>
          }
          groupBy: {
            args: Prisma.SupplierTypeAssignmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupplierTypeAssignmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupplierTypeAssignmentCountArgs<ExtArgs>
            result: $Utils.Optional<SupplierTypeAssignmentCountAggregateOutputType> | number
          }
        }
      }
      PurchaseRequestRecord: {
        payload: Prisma.$PurchaseRequestRecordPayload<ExtArgs>
        fields: Prisma.PurchaseRequestRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchaseRequestRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseRequestRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchaseRequestRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseRequestRecordPayload>
          }
          findFirst: {
            args: Prisma.PurchaseRequestRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseRequestRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchaseRequestRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseRequestRecordPayload>
          }
          findMany: {
            args: Prisma.PurchaseRequestRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseRequestRecordPayload>[]
          }
          create: {
            args: Prisma.PurchaseRequestRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseRequestRecordPayload>
          }
          createMany: {
            args: Prisma.PurchaseRequestRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PurchaseRequestRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseRequestRecordPayload>[]
          }
          delete: {
            args: Prisma.PurchaseRequestRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseRequestRecordPayload>
          }
          update: {
            args: Prisma.PurchaseRequestRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseRequestRecordPayload>
          }
          deleteMany: {
            args: Prisma.PurchaseRequestRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchaseRequestRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PurchaseRequestRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseRequestRecordPayload>[]
          }
          upsert: {
            args: Prisma.PurchaseRequestRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseRequestRecordPayload>
          }
          aggregate: {
            args: Prisma.PurchaseRequestRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchaseRequestRecord>
          }
          groupBy: {
            args: Prisma.PurchaseRequestRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchaseRequestRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchaseRequestRecordCountArgs<ExtArgs>
            result: $Utils.Optional<PurchaseRequestRecordCountAggregateOutputType> | number
          }
        }
      }
      PurchaseOrderRecord: {
        payload: Prisma.$PurchaseOrderRecordPayload<ExtArgs>
        fields: Prisma.PurchaseOrderRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PurchaseOrderRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PurchaseOrderRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderRecordPayload>
          }
          findFirst: {
            args: Prisma.PurchaseOrderRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PurchaseOrderRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderRecordPayload>
          }
          findMany: {
            args: Prisma.PurchaseOrderRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderRecordPayload>[]
          }
          create: {
            args: Prisma.PurchaseOrderRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderRecordPayload>
          }
          createMany: {
            args: Prisma.PurchaseOrderRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PurchaseOrderRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderRecordPayload>[]
          }
          delete: {
            args: Prisma.PurchaseOrderRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderRecordPayload>
          }
          update: {
            args: Prisma.PurchaseOrderRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderRecordPayload>
          }
          deleteMany: {
            args: Prisma.PurchaseOrderRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PurchaseOrderRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PurchaseOrderRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderRecordPayload>[]
          }
          upsert: {
            args: Prisma.PurchaseOrderRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PurchaseOrderRecordPayload>
          }
          aggregate: {
            args: Prisma.PurchaseOrderRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePurchaseOrderRecord>
          }
          groupBy: {
            args: Prisma.PurchaseOrderRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<PurchaseOrderRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.PurchaseOrderRecordCountArgs<ExtArgs>
            result: $Utils.Optional<PurchaseOrderRecordCountAggregateOutputType> | number
          }
        }
      }
      SupplierOrderAcknowledgementRecord: {
        payload: Prisma.$SupplierOrderAcknowledgementRecordPayload<ExtArgs>
        fields: Prisma.SupplierOrderAcknowledgementRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupplierOrderAcknowledgementRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderAcknowledgementRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupplierOrderAcknowledgementRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderAcknowledgementRecordPayload>
          }
          findFirst: {
            args: Prisma.SupplierOrderAcknowledgementRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderAcknowledgementRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupplierOrderAcknowledgementRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderAcknowledgementRecordPayload>
          }
          findMany: {
            args: Prisma.SupplierOrderAcknowledgementRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderAcknowledgementRecordPayload>[]
          }
          create: {
            args: Prisma.SupplierOrderAcknowledgementRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderAcknowledgementRecordPayload>
          }
          createMany: {
            args: Prisma.SupplierOrderAcknowledgementRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SupplierOrderAcknowledgementRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderAcknowledgementRecordPayload>[]
          }
          delete: {
            args: Prisma.SupplierOrderAcknowledgementRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderAcknowledgementRecordPayload>
          }
          update: {
            args: Prisma.SupplierOrderAcknowledgementRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderAcknowledgementRecordPayload>
          }
          deleteMany: {
            args: Prisma.SupplierOrderAcknowledgementRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupplierOrderAcknowledgementRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SupplierOrderAcknowledgementRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderAcknowledgementRecordPayload>[]
          }
          upsert: {
            args: Prisma.SupplierOrderAcknowledgementRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierOrderAcknowledgementRecordPayload>
          }
          aggregate: {
            args: Prisma.SupplierOrderAcknowledgementRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupplierOrderAcknowledgementRecord>
          }
          groupBy: {
            args: Prisma.SupplierOrderAcknowledgementRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupplierOrderAcknowledgementRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupplierOrderAcknowledgementRecordCountArgs<ExtArgs>
            result: $Utils.Optional<SupplierOrderAcknowledgementRecordCountAggregateOutputType> | number
          }
        }
      }
      SupplierDeliveryRecordStore: {
        payload: Prisma.$SupplierDeliveryRecordStorePayload<ExtArgs>
        fields: Prisma.SupplierDeliveryRecordStoreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupplierDeliveryRecordStoreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierDeliveryRecordStorePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupplierDeliveryRecordStoreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierDeliveryRecordStorePayload>
          }
          findFirst: {
            args: Prisma.SupplierDeliveryRecordStoreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierDeliveryRecordStorePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupplierDeliveryRecordStoreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierDeliveryRecordStorePayload>
          }
          findMany: {
            args: Prisma.SupplierDeliveryRecordStoreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierDeliveryRecordStorePayload>[]
          }
          create: {
            args: Prisma.SupplierDeliveryRecordStoreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierDeliveryRecordStorePayload>
          }
          createMany: {
            args: Prisma.SupplierDeliveryRecordStoreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SupplierDeliveryRecordStoreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierDeliveryRecordStorePayload>[]
          }
          delete: {
            args: Prisma.SupplierDeliveryRecordStoreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierDeliveryRecordStorePayload>
          }
          update: {
            args: Prisma.SupplierDeliveryRecordStoreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierDeliveryRecordStorePayload>
          }
          deleteMany: {
            args: Prisma.SupplierDeliveryRecordStoreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupplierDeliveryRecordStoreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SupplierDeliveryRecordStoreUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierDeliveryRecordStorePayload>[]
          }
          upsert: {
            args: Prisma.SupplierDeliveryRecordStoreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierDeliveryRecordStorePayload>
          }
          aggregate: {
            args: Prisma.SupplierDeliveryRecordStoreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupplierDeliveryRecordStore>
          }
          groupBy: {
            args: Prisma.SupplierDeliveryRecordStoreGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupplierDeliveryRecordStoreGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupplierDeliveryRecordStoreCountArgs<ExtArgs>
            result: $Utils.Optional<SupplierDeliveryRecordStoreCountAggregateOutputType> | number
          }
        }
      }
      SupplierGrnRecordStore: {
        payload: Prisma.$SupplierGrnRecordStorePayload<ExtArgs>
        fields: Prisma.SupplierGrnRecordStoreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupplierGrnRecordStoreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierGrnRecordStorePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupplierGrnRecordStoreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierGrnRecordStorePayload>
          }
          findFirst: {
            args: Prisma.SupplierGrnRecordStoreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierGrnRecordStorePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupplierGrnRecordStoreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierGrnRecordStorePayload>
          }
          findMany: {
            args: Prisma.SupplierGrnRecordStoreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierGrnRecordStorePayload>[]
          }
          create: {
            args: Prisma.SupplierGrnRecordStoreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierGrnRecordStorePayload>
          }
          createMany: {
            args: Prisma.SupplierGrnRecordStoreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SupplierGrnRecordStoreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierGrnRecordStorePayload>[]
          }
          delete: {
            args: Prisma.SupplierGrnRecordStoreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierGrnRecordStorePayload>
          }
          update: {
            args: Prisma.SupplierGrnRecordStoreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierGrnRecordStorePayload>
          }
          deleteMany: {
            args: Prisma.SupplierGrnRecordStoreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupplierGrnRecordStoreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SupplierGrnRecordStoreUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierGrnRecordStorePayload>[]
          }
          upsert: {
            args: Prisma.SupplierGrnRecordStoreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierGrnRecordStorePayload>
          }
          aggregate: {
            args: Prisma.SupplierGrnRecordStoreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupplierGrnRecordStore>
          }
          groupBy: {
            args: Prisma.SupplierGrnRecordStoreGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupplierGrnRecordStoreGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupplierGrnRecordStoreCountArgs<ExtArgs>
            result: $Utils.Optional<SupplierGrnRecordStoreCountAggregateOutputType> | number
          }
        }
      }
      ChatSession: {
        payload: Prisma.$ChatSessionPayload<ExtArgs>
        fields: Prisma.ChatSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          findFirst: {
            args: Prisma.ChatSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          findMany: {
            args: Prisma.ChatSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          create: {
            args: Prisma.ChatSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          createMany: {
            args: Prisma.ChatSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          delete: {
            args: Prisma.ChatSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          update: {
            args: Prisma.ChatSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          deleteMany: {
            args: Prisma.ChatSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          upsert: {
            args: Prisma.ChatSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          aggregate: {
            args: Prisma.ChatSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatSession>
          }
          groupBy: {
            args: Prisma.ChatSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatSessionCountArgs<ExtArgs>
            result: $Utils.Optional<ChatSessionCountAggregateOutputType> | number
          }
        }
      }
      ChatMessage: {
        payload: Prisma.$ChatMessagePayload<ExtArgs>
        fields: Prisma.ChatMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findFirst: {
            args: Prisma.ChatMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findMany: {
            args: Prisma.ChatMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          create: {
            args: Prisma.ChatMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          createMany: {
            args: Prisma.ChatMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          delete: {
            args: Prisma.ChatMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          update: {
            args: Prisma.ChatMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          deleteMany: {
            args: Prisma.ChatMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          upsert: {
            args: Prisma.ChatMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          aggregate: {
            args: Prisma.ChatMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatMessage>
          }
          groupBy: {
            args: Prisma.ChatMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageCountAggregateOutputType> | number
          }
        }
      }
      Source: {
        payload: Prisma.$SourcePayload<ExtArgs>
        fields: Prisma.SourceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SourceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SourceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>
          }
          findFirst: {
            args: Prisma.SourceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SourceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>
          }
          findMany: {
            args: Prisma.SourceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>[]
          }
          create: {
            args: Prisma.SourceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>
          }
          createMany: {
            args: Prisma.SourceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SourceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>[]
          }
          delete: {
            args: Prisma.SourceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>
          }
          update: {
            args: Prisma.SourceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>
          }
          deleteMany: {
            args: Prisma.SourceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SourceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SourceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>[]
          }
          upsert: {
            args: Prisma.SourceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourcePayload>
          }
          aggregate: {
            args: Prisma.SourceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSource>
          }
          groupBy: {
            args: Prisma.SourceGroupByArgs<ExtArgs>
            result: $Utils.Optional<SourceGroupByOutputType>[]
          }
          count: {
            args: Prisma.SourceCountArgs<ExtArgs>
            result: $Utils.Optional<SourceCountAggregateOutputType> | number
          }
        }
      }
      SourceChunk: {
        payload: Prisma.$SourceChunkPayload<ExtArgs>
        fields: Prisma.SourceChunkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SourceChunkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceChunkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SourceChunkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceChunkPayload>
          }
          findFirst: {
            args: Prisma.SourceChunkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceChunkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SourceChunkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceChunkPayload>
          }
          findMany: {
            args: Prisma.SourceChunkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceChunkPayload>[]
          }
          create: {
            args: Prisma.SourceChunkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceChunkPayload>
          }
          createMany: {
            args: Prisma.SourceChunkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SourceChunkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceChunkPayload>[]
          }
          delete: {
            args: Prisma.SourceChunkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceChunkPayload>
          }
          update: {
            args: Prisma.SourceChunkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceChunkPayload>
          }
          deleteMany: {
            args: Prisma.SourceChunkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SourceChunkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SourceChunkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceChunkPayload>[]
          }
          upsert: {
            args: Prisma.SourceChunkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SourceChunkPayload>
          }
          aggregate: {
            args: Prisma.SourceChunkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSourceChunk>
          }
          groupBy: {
            args: Prisma.SourceChunkGroupByArgs<ExtArgs>
            result: $Utils.Optional<SourceChunkGroupByOutputType>[]
          }
          count: {
            args: Prisma.SourceChunkCountArgs<ExtArgs>
            result: $Utils.Optional<SourceChunkCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    notification?: NotificationOmit
    feedback?: FeedbackOmit
    roleChangeAudit?: RoleChangeAuditOmit
    passwordResetCode?: PasswordResetCodeOmit
    purchasingLookup?: PurchasingLookupOmit
    supplierTypeAssignment?: SupplierTypeAssignmentOmit
    purchaseRequestRecord?: PurchaseRequestRecordOmit
    purchaseOrderRecord?: PurchaseOrderRecordOmit
    supplierOrderAcknowledgementRecord?: SupplierOrderAcknowledgementRecordOmit
    supplierDeliveryRecordStore?: SupplierDeliveryRecordStoreOmit
    supplierGrnRecordStore?: SupplierGrnRecordStoreOmit
    chatSession?: ChatSessionOmit
    chatMessage?: ChatMessageOmit
    source?: SourceOmit
    sourceChunk?: SourceChunkOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    roleChangeAuditsAsTarget: number
    passwordResetCodes: number
    supplierTypeAssignments: number
    notifications: number
    feedbacks: number
    chatSessions: number
    sources: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roleChangeAuditsAsTarget?: boolean | UserCountOutputTypeCountRoleChangeAuditsAsTargetArgs
    passwordResetCodes?: boolean | UserCountOutputTypeCountPasswordResetCodesArgs
    supplierTypeAssignments?: boolean | UserCountOutputTypeCountSupplierTypeAssignmentsArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
    feedbacks?: boolean | UserCountOutputTypeCountFeedbacksArgs
    chatSessions?: boolean | UserCountOutputTypeCountChatSessionsArgs
    sources?: boolean | UserCountOutputTypeCountSourcesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRoleChangeAuditsAsTargetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleChangeAuditWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPasswordResetCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetCodeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSupplierTypeAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupplierTypeAssignmentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFeedbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeedbackWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChatSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SourceWhereInput
  }


  /**
   * Count Type ChatSessionCountOutputType
   */

  export type ChatSessionCountOutputType = {
    messages: number
    sources: number
  }

  export type ChatSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ChatSessionCountOutputTypeCountMessagesArgs
    sources?: boolean | ChatSessionCountOutputTypeCountSourcesArgs
  }

  // Custom InputTypes
  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSessionCountOutputType
     */
    select?: ChatSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
  }

  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeCountSourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SourceWhereInput
  }


  /**
   * Count Type SourceCountOutputType
   */

  export type SourceCountOutputType = {
    chunks: number
  }

  export type SourceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    chunks?: boolean | SourceCountOutputTypeCountChunksArgs
  }

  // Custom InputTypes
  /**
   * SourceCountOutputType without action
   */
  export type SourceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceCountOutputType
     */
    select?: SourceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SourceCountOutputType without action
   */
  export type SourceCountOutputTypeCountChunksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SourceChunkWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    department: string | null
    avatarUrl: string | null
    isActive: boolean | null
    preferredLanguage: $Enums.Language | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    password: string | null
    role: string | null
    department: string | null
    avatarUrl: string | null
    isActive: boolean | null
    preferredLanguage: $Enums.Language | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    department: number
    avatarUrl: number
    isActive: number
    preferredLanguage: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    department?: true
    avatarUrl?: true
    isActive?: true
    preferredLanguage?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    department?: true
    avatarUrl?: true
    isActive?: true
    preferredLanguage?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    department?: true
    avatarUrl?: true
    isActive?: true
    preferredLanguage?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    name: string | null
    email: string
    password: string
    role: string
    department: string | null
    avatarUrl: string | null
    isActive: boolean
    preferredLanguage: $Enums.Language
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    department?: boolean
    avatarUrl?: boolean
    isActive?: boolean
    preferredLanguage?: boolean
    roleChangeAuditsAsTarget?: boolean | User$roleChangeAuditsAsTargetArgs<ExtArgs>
    passwordResetCodes?: boolean | User$passwordResetCodesArgs<ExtArgs>
    supplierTypeAssignments?: boolean | User$supplierTypeAssignmentsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    feedbacks?: boolean | User$feedbacksArgs<ExtArgs>
    chatSessions?: boolean | User$chatSessionsArgs<ExtArgs>
    sources?: boolean | User$sourcesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    department?: boolean
    avatarUrl?: boolean
    isActive?: boolean
    preferredLanguage?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    department?: boolean
    avatarUrl?: boolean
    isActive?: boolean
    preferredLanguage?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    department?: boolean
    avatarUrl?: boolean
    isActive?: boolean
    preferredLanguage?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "password" | "role" | "department" | "avatarUrl" | "isActive" | "preferredLanguage", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roleChangeAuditsAsTarget?: boolean | User$roleChangeAuditsAsTargetArgs<ExtArgs>
    passwordResetCodes?: boolean | User$passwordResetCodesArgs<ExtArgs>
    supplierTypeAssignments?: boolean | User$supplierTypeAssignmentsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    feedbacks?: boolean | User$feedbacksArgs<ExtArgs>
    chatSessions?: boolean | User$chatSessionsArgs<ExtArgs>
    sources?: boolean | User$sourcesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      roleChangeAuditsAsTarget: Prisma.$RoleChangeAuditPayload<ExtArgs>[]
      passwordResetCodes: Prisma.$PasswordResetCodePayload<ExtArgs>[]
      supplierTypeAssignments: Prisma.$SupplierTypeAssignmentPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
      feedbacks: Prisma.$FeedbackPayload<ExtArgs>[]
      chatSessions: Prisma.$ChatSessionPayload<ExtArgs>[]
      sources: Prisma.$SourcePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string | null
      email: string
      password: string
      role: string
      department: string | null
      avatarUrl: string | null
      isActive: boolean
      preferredLanguage: $Enums.Language
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    roleChangeAuditsAsTarget<T extends User$roleChangeAuditsAsTargetArgs<ExtArgs> = {}>(args?: Subset<T, User$roleChangeAuditsAsTargetArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleChangeAuditPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    passwordResetCodes<T extends User$passwordResetCodesArgs<ExtArgs> = {}>(args?: Subset<T, User$passwordResetCodesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    supplierTypeAssignments<T extends User$supplierTypeAssignmentsArgs<ExtArgs> = {}>(args?: Subset<T, User$supplierTypeAssignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierTypeAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    feedbacks<T extends User$feedbacksArgs<ExtArgs> = {}>(args?: Subset<T, User$feedbacksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chatSessions<T extends User$chatSessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$chatSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sources<T extends User$sourcesArgs<ExtArgs> = {}>(args?: Subset<T, User$sourcesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly department: FieldRef<"User", 'String'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly preferredLanguage: FieldRef<"User", 'Language'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.roleChangeAuditsAsTarget
   */
  export type User$roleChangeAuditsAsTargetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleChangeAudit
     */
    select?: RoleChangeAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleChangeAudit
     */
    omit?: RoleChangeAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleChangeAuditInclude<ExtArgs> | null
    where?: RoleChangeAuditWhereInput
    orderBy?: RoleChangeAuditOrderByWithRelationInput | RoleChangeAuditOrderByWithRelationInput[]
    cursor?: RoleChangeAuditWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoleChangeAuditScalarFieldEnum | RoleChangeAuditScalarFieldEnum[]
  }

  /**
   * User.passwordResetCodes
   */
  export type User$passwordResetCodesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetCodeInclude<ExtArgs> | null
    where?: PasswordResetCodeWhereInput
    orderBy?: PasswordResetCodeOrderByWithRelationInput | PasswordResetCodeOrderByWithRelationInput[]
    cursor?: PasswordResetCodeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PasswordResetCodeScalarFieldEnum | PasswordResetCodeScalarFieldEnum[]
  }

  /**
   * User.supplierTypeAssignments
   */
  export type User$supplierTypeAssignmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierTypeAssignment
     */
    select?: SupplierTypeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierTypeAssignment
     */
    omit?: SupplierTypeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierTypeAssignmentInclude<ExtArgs> | null
    where?: SupplierTypeAssignmentWhereInput
    orderBy?: SupplierTypeAssignmentOrderByWithRelationInput | SupplierTypeAssignmentOrderByWithRelationInput[]
    cursor?: SupplierTypeAssignmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SupplierTypeAssignmentScalarFieldEnum | SupplierTypeAssignmentScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.feedbacks
   */
  export type User$feedbacksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    where?: FeedbackWhereInput
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    cursor?: FeedbackWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * User.chatSessions
   */
  export type User$chatSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    where?: ChatSessionWhereInput
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    cursor?: ChatSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * User.sources
   */
  export type User$sourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    where?: SourceWhereInput
    orderBy?: SourceOrderByWithRelationInput | SourceOrderByWithRelationInput[]
    cursor?: SourceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SourceScalarFieldEnum | SourceScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type NotificationSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type NotificationMinAggregateOutputType = {
    id: number | null
    userId: number | null
    title: string | null
    message: string | null
    type: string | null
    channel: string | null
    refType: string | null
    refId: string | null
    isRead: boolean | null
    createdAt: Date | null
    readAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    title: string | null
    message: string | null
    type: string | null
    channel: string | null
    refType: string | null
    refId: string | null
    isRead: boolean | null
    createdAt: Date | null
    readAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    message: number
    type: number
    channel: number
    refType: number
    refId: number
    isRead: number
    createdAt: number
    readAt: number
    _all: number
  }


  export type NotificationAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type NotificationSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    message?: true
    type?: true
    channel?: true
    refType?: true
    refId?: true
    isRead?: true
    createdAt?: true
    readAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    message?: true
    type?: true
    channel?: true
    refType?: true
    refId?: true
    isRead?: true
    createdAt?: true
    readAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    message?: true
    type?: true
    channel?: true
    refType?: true
    refId?: true
    isRead?: true
    createdAt?: true
    readAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _avg?: NotificationAvgAggregateInputType
    _sum?: NotificationSumAggregateInputType
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: number
    userId: number
    title: string
    message: string
    type: string
    channel: string
    refType: string | null
    refId: string | null
    isRead: boolean
    createdAt: Date
    readAt: Date | null
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    channel?: boolean
    refType?: boolean
    refId?: boolean
    isRead?: boolean
    createdAt?: boolean
    readAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    channel?: boolean
    refType?: boolean
    refId?: boolean
    isRead?: boolean
    createdAt?: boolean
    readAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    channel?: boolean
    refType?: boolean
    refId?: boolean
    isRead?: boolean
    createdAt?: boolean
    readAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    channel?: boolean
    refType?: boolean
    refId?: boolean
    isRead?: boolean
    createdAt?: boolean
    readAt?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "message" | "type" | "channel" | "refType" | "refId" | "isRead" | "createdAt" | "readAt", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      title: string
      message: string
      type: string
      channel: string
      refType: string | null
      refId: string | null
      isRead: boolean
      createdAt: Date
      readAt: Date | null
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'Int'>
    readonly userId: FieldRef<"Notification", 'Int'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'String'>
    readonly channel: FieldRef<"Notification", 'String'>
    readonly refType: FieldRef<"Notification", 'String'>
    readonly refId: FieldRef<"Notification", 'String'>
    readonly isRead: FieldRef<"Notification", 'Boolean'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
    readonly readAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model Feedback
   */

  export type AggregateFeedback = {
    _count: FeedbackCountAggregateOutputType | null
    _avg: FeedbackAvgAggregateOutputType | null
    _sum: FeedbackSumAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  export type FeedbackAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type FeedbackSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type FeedbackMinAggregateOutputType = {
    id: number | null
    userId: number | null
    type: string | null
    description: string | null
    status: string | null
    adminComment: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FeedbackMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    type: string | null
    description: string | null
    status: string | null
    adminComment: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FeedbackCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    description: number
    status: number
    adminComment: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FeedbackAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type FeedbackSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type FeedbackMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    description?: true
    status?: true
    adminComment?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FeedbackMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    description?: true
    status?: true
    adminComment?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FeedbackCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    description?: true
    status?: true
    adminComment?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FeedbackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feedback to aggregate.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Feedbacks
    **/
    _count?: true | FeedbackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FeedbackAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FeedbackSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeedbackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeedbackMaxAggregateInputType
  }

  export type GetFeedbackAggregateType<T extends FeedbackAggregateArgs> = {
        [P in keyof T & keyof AggregateFeedback]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeedback[P]>
      : GetScalarType<T[P], AggregateFeedback[P]>
  }




  export type FeedbackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeedbackWhereInput
    orderBy?: FeedbackOrderByWithAggregationInput | FeedbackOrderByWithAggregationInput[]
    by: FeedbackScalarFieldEnum[] | FeedbackScalarFieldEnum
    having?: FeedbackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeedbackCountAggregateInputType | true
    _avg?: FeedbackAvgAggregateInputType
    _sum?: FeedbackSumAggregateInputType
    _min?: FeedbackMinAggregateInputType
    _max?: FeedbackMaxAggregateInputType
  }

  export type FeedbackGroupByOutputType = {
    id: number
    userId: number
    type: string
    description: string
    status: string
    adminComment: string | null
    createdAt: Date
    updatedAt: Date
    _count: FeedbackCountAggregateOutputType | null
    _avg: FeedbackAvgAggregateOutputType | null
    _sum: FeedbackSumAggregateOutputType | null
    _min: FeedbackMinAggregateOutputType | null
    _max: FeedbackMaxAggregateOutputType | null
  }

  type GetFeedbackGroupByPayload<T extends FeedbackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeedbackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeedbackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
            : GetScalarType<T[P], FeedbackGroupByOutputType[P]>
        }
      >
    >


  export type FeedbackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    description?: boolean
    status?: boolean
    adminComment?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    description?: boolean
    status?: boolean
    adminComment?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    description?: boolean
    status?: boolean
    adminComment?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["feedback"]>

  export type FeedbackSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    description?: boolean
    status?: boolean
    adminComment?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FeedbackOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "description" | "status" | "adminComment" | "createdAt" | "updatedAt", ExtArgs["result"]["feedback"]>
  export type FeedbackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FeedbackIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FeedbackIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FeedbackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Feedback"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      type: string
      description: string
      status: string
      adminComment: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["feedback"]>
    composites: {}
  }

  type FeedbackGetPayload<S extends boolean | null | undefined | FeedbackDefaultArgs> = $Result.GetResult<Prisma.$FeedbackPayload, S>

  type FeedbackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FeedbackFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FeedbackCountAggregateInputType | true
    }

  export interface FeedbackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Feedback'], meta: { name: 'Feedback' } }
    /**
     * Find zero or one Feedback that matches the filter.
     * @param {FeedbackFindUniqueArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FeedbackFindUniqueArgs>(args: SelectSubset<T, FeedbackFindUniqueArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Feedback that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FeedbackFindUniqueOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FeedbackFindUniqueOrThrowArgs>(args: SelectSubset<T, FeedbackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindFirstArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FeedbackFindFirstArgs>(args?: SelectSubset<T, FeedbackFindFirstArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Feedback that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindFirstOrThrowArgs} args - Arguments to find a Feedback
     * @example
     * // Get one Feedback
     * const feedback = await prisma.feedback.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FeedbackFindFirstOrThrowArgs>(args?: SelectSubset<T, FeedbackFindFirstOrThrowArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Feedbacks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Feedbacks
     * const feedbacks = await prisma.feedback.findMany()
     * 
     * // Get first 10 Feedbacks
     * const feedbacks = await prisma.feedback.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const feedbackWithIdOnly = await prisma.feedback.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FeedbackFindManyArgs>(args?: SelectSubset<T, FeedbackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Feedback.
     * @param {FeedbackCreateArgs} args - Arguments to create a Feedback.
     * @example
     * // Create one Feedback
     * const Feedback = await prisma.feedback.create({
     *   data: {
     *     // ... data to create a Feedback
     *   }
     * })
     * 
     */
    create<T extends FeedbackCreateArgs>(args: SelectSubset<T, FeedbackCreateArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Feedbacks.
     * @param {FeedbackCreateManyArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedback = await prisma.feedback.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FeedbackCreateManyArgs>(args?: SelectSubset<T, FeedbackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Feedbacks and returns the data saved in the database.
     * @param {FeedbackCreateManyAndReturnArgs} args - Arguments to create many Feedbacks.
     * @example
     * // Create many Feedbacks
     * const feedback = await prisma.feedback.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Feedbacks and only return the `id`
     * const feedbackWithIdOnly = await prisma.feedback.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FeedbackCreateManyAndReturnArgs>(args?: SelectSubset<T, FeedbackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Feedback.
     * @param {FeedbackDeleteArgs} args - Arguments to delete one Feedback.
     * @example
     * // Delete one Feedback
     * const Feedback = await prisma.feedback.delete({
     *   where: {
     *     // ... filter to delete one Feedback
     *   }
     * })
     * 
     */
    delete<T extends FeedbackDeleteArgs>(args: SelectSubset<T, FeedbackDeleteArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Feedback.
     * @param {FeedbackUpdateArgs} args - Arguments to update one Feedback.
     * @example
     * // Update one Feedback
     * const feedback = await prisma.feedback.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FeedbackUpdateArgs>(args: SelectSubset<T, FeedbackUpdateArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Feedbacks.
     * @param {FeedbackDeleteManyArgs} args - Arguments to filter Feedbacks to delete.
     * @example
     * // Delete a few Feedbacks
     * const { count } = await prisma.feedback.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FeedbackDeleteManyArgs>(args?: SelectSubset<T, FeedbackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Feedbacks
     * const feedback = await prisma.feedback.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FeedbackUpdateManyArgs>(args: SelectSubset<T, FeedbackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Feedbacks and returns the data updated in the database.
     * @param {FeedbackUpdateManyAndReturnArgs} args - Arguments to update many Feedbacks.
     * @example
     * // Update many Feedbacks
     * const feedback = await prisma.feedback.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Feedbacks and only return the `id`
     * const feedbackWithIdOnly = await prisma.feedback.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FeedbackUpdateManyAndReturnArgs>(args: SelectSubset<T, FeedbackUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Feedback.
     * @param {FeedbackUpsertArgs} args - Arguments to update or create a Feedback.
     * @example
     * // Update or create a Feedback
     * const feedback = await prisma.feedback.upsert({
     *   create: {
     *     // ... data to create a Feedback
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Feedback we want to update
     *   }
     * })
     */
    upsert<T extends FeedbackUpsertArgs>(args: SelectSubset<T, FeedbackUpsertArgs<ExtArgs>>): Prisma__FeedbackClient<$Result.GetResult<Prisma.$FeedbackPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Feedbacks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackCountArgs} args - Arguments to filter Feedbacks to count.
     * @example
     * // Count the number of Feedbacks
     * const count = await prisma.feedback.count({
     *   where: {
     *     // ... the filter for the Feedbacks we want to count
     *   }
     * })
    **/
    count<T extends FeedbackCountArgs>(
      args?: Subset<T, FeedbackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeedbackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeedbackAggregateArgs>(args: Subset<T, FeedbackAggregateArgs>): Prisma.PrismaPromise<GetFeedbackAggregateType<T>>

    /**
     * Group by Feedback.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeedbackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FeedbackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FeedbackGroupByArgs['orderBy'] }
        : { orderBy?: FeedbackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FeedbackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeedbackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Feedback model
   */
  readonly fields: FeedbackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Feedback.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FeedbackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Feedback model
   */
  interface FeedbackFieldRefs {
    readonly id: FieldRef<"Feedback", 'Int'>
    readonly userId: FieldRef<"Feedback", 'Int'>
    readonly type: FieldRef<"Feedback", 'String'>
    readonly description: FieldRef<"Feedback", 'String'>
    readonly status: FieldRef<"Feedback", 'String'>
    readonly adminComment: FieldRef<"Feedback", 'String'>
    readonly createdAt: FieldRef<"Feedback", 'DateTime'>
    readonly updatedAt: FieldRef<"Feedback", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Feedback findUnique
   */
  export type FeedbackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback findUniqueOrThrow
   */
  export type FeedbackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback findFirst
   */
  export type FeedbackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback findFirstOrThrow
   */
  export type FeedbackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedback to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Feedbacks.
     */
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback findMany
   */
  export type FeedbackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter, which Feedbacks to fetch.
     */
    where?: FeedbackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Feedbacks to fetch.
     */
    orderBy?: FeedbackOrderByWithRelationInput | FeedbackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Feedbacks.
     */
    cursor?: FeedbackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Feedbacks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Feedbacks.
     */
    skip?: number
    distinct?: FeedbackScalarFieldEnum | FeedbackScalarFieldEnum[]
  }

  /**
   * Feedback create
   */
  export type FeedbackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * The data needed to create a Feedback.
     */
    data: XOR<FeedbackCreateInput, FeedbackUncheckedCreateInput>
  }

  /**
   * Feedback createMany
   */
  export type FeedbackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Feedbacks.
     */
    data: FeedbackCreateManyInput | FeedbackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Feedback createManyAndReturn
   */
  export type FeedbackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data used to create many Feedbacks.
     */
    data: FeedbackCreateManyInput | FeedbackCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Feedback update
   */
  export type FeedbackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * The data needed to update a Feedback.
     */
    data: XOR<FeedbackUpdateInput, FeedbackUncheckedUpdateInput>
    /**
     * Choose, which Feedback to update.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback updateMany
   */
  export type FeedbackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Feedbacks.
     */
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyInput>
    /**
     * Filter which Feedbacks to update
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to update.
     */
    limit?: number
  }

  /**
   * Feedback updateManyAndReturn
   */
  export type FeedbackUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * The data used to update Feedbacks.
     */
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyInput>
    /**
     * Filter which Feedbacks to update
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Feedback upsert
   */
  export type FeedbackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * The filter to search for the Feedback to update in case it exists.
     */
    where: FeedbackWhereUniqueInput
    /**
     * In case the Feedback found by the `where` argument doesn't exist, create a new Feedback with this data.
     */
    create: XOR<FeedbackCreateInput, FeedbackUncheckedCreateInput>
    /**
     * In case the Feedback was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FeedbackUpdateInput, FeedbackUncheckedUpdateInput>
  }

  /**
   * Feedback delete
   */
  export type FeedbackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
    /**
     * Filter which Feedback to delete.
     */
    where: FeedbackWhereUniqueInput
  }

  /**
   * Feedback deleteMany
   */
  export type FeedbackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Feedbacks to delete
     */
    where?: FeedbackWhereInput
    /**
     * Limit how many Feedbacks to delete.
     */
    limit?: number
  }

  /**
   * Feedback without action
   */
  export type FeedbackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Feedback
     */
    select?: FeedbackSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Feedback
     */
    omit?: FeedbackOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FeedbackInclude<ExtArgs> | null
  }


  /**
   * Model RoleChangeAudit
   */

  export type AggregateRoleChangeAudit = {
    _count: RoleChangeAuditCountAggregateOutputType | null
    _avg: RoleChangeAuditAvgAggregateOutputType | null
    _sum: RoleChangeAuditSumAggregateOutputType | null
    _min: RoleChangeAuditMinAggregateOutputType | null
    _max: RoleChangeAuditMaxAggregateOutputType | null
  }

  export type RoleChangeAuditAvgAggregateOutputType = {
    id: number | null
    targetId: number | null
  }

  export type RoleChangeAuditSumAggregateOutputType = {
    id: number | null
    targetId: number | null
  }

  export type RoleChangeAuditMinAggregateOutputType = {
    id: number | null
    targetId: number | null
    fromRole: string | null
    toRole: string | null
    actorEmail: string | null
    actorName: string | null
    createdAt: Date | null
  }

  export type RoleChangeAuditMaxAggregateOutputType = {
    id: number | null
    targetId: number | null
    fromRole: string | null
    toRole: string | null
    actorEmail: string | null
    actorName: string | null
    createdAt: Date | null
  }

  export type RoleChangeAuditCountAggregateOutputType = {
    id: number
    targetId: number
    fromRole: number
    toRole: number
    actorEmail: number
    actorName: number
    createdAt: number
    _all: number
  }


  export type RoleChangeAuditAvgAggregateInputType = {
    id?: true
    targetId?: true
  }

  export type RoleChangeAuditSumAggregateInputType = {
    id?: true
    targetId?: true
  }

  export type RoleChangeAuditMinAggregateInputType = {
    id?: true
    targetId?: true
    fromRole?: true
    toRole?: true
    actorEmail?: true
    actorName?: true
    createdAt?: true
  }

  export type RoleChangeAuditMaxAggregateInputType = {
    id?: true
    targetId?: true
    fromRole?: true
    toRole?: true
    actorEmail?: true
    actorName?: true
    createdAt?: true
  }

  export type RoleChangeAuditCountAggregateInputType = {
    id?: true
    targetId?: true
    fromRole?: true
    toRole?: true
    actorEmail?: true
    actorName?: true
    createdAt?: true
    _all?: true
  }

  export type RoleChangeAuditAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoleChangeAudit to aggregate.
     */
    where?: RoleChangeAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleChangeAudits to fetch.
     */
    orderBy?: RoleChangeAuditOrderByWithRelationInput | RoleChangeAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleChangeAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleChangeAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleChangeAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoleChangeAudits
    **/
    _count?: true | RoleChangeAuditCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoleChangeAuditAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoleChangeAuditSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleChangeAuditMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleChangeAuditMaxAggregateInputType
  }

  export type GetRoleChangeAuditAggregateType<T extends RoleChangeAuditAggregateArgs> = {
        [P in keyof T & keyof AggregateRoleChangeAudit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoleChangeAudit[P]>
      : GetScalarType<T[P], AggregateRoleChangeAudit[P]>
  }




  export type RoleChangeAuditGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleChangeAuditWhereInput
    orderBy?: RoleChangeAuditOrderByWithAggregationInput | RoleChangeAuditOrderByWithAggregationInput[]
    by: RoleChangeAuditScalarFieldEnum[] | RoleChangeAuditScalarFieldEnum
    having?: RoleChangeAuditScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleChangeAuditCountAggregateInputType | true
    _avg?: RoleChangeAuditAvgAggregateInputType
    _sum?: RoleChangeAuditSumAggregateInputType
    _min?: RoleChangeAuditMinAggregateInputType
    _max?: RoleChangeAuditMaxAggregateInputType
  }

  export type RoleChangeAuditGroupByOutputType = {
    id: number
    targetId: number
    fromRole: string
    toRole: string
    actorEmail: string
    actorName: string | null
    createdAt: Date
    _count: RoleChangeAuditCountAggregateOutputType | null
    _avg: RoleChangeAuditAvgAggregateOutputType | null
    _sum: RoleChangeAuditSumAggregateOutputType | null
    _min: RoleChangeAuditMinAggregateOutputType | null
    _max: RoleChangeAuditMaxAggregateOutputType | null
  }

  type GetRoleChangeAuditGroupByPayload<T extends RoleChangeAuditGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleChangeAuditGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleChangeAuditGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleChangeAuditGroupByOutputType[P]>
            : GetScalarType<T[P], RoleChangeAuditGroupByOutputType[P]>
        }
      >
    >


  export type RoleChangeAuditSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    targetId?: boolean
    fromRole?: boolean
    toRole?: boolean
    actorEmail?: boolean
    actorName?: boolean
    createdAt?: boolean
    target?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleChangeAudit"]>

  export type RoleChangeAuditSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    targetId?: boolean
    fromRole?: boolean
    toRole?: boolean
    actorEmail?: boolean
    actorName?: boolean
    createdAt?: boolean
    target?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleChangeAudit"]>

  export type RoleChangeAuditSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    targetId?: boolean
    fromRole?: boolean
    toRole?: boolean
    actorEmail?: boolean
    actorName?: boolean
    createdAt?: boolean
    target?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roleChangeAudit"]>

  export type RoleChangeAuditSelectScalar = {
    id?: boolean
    targetId?: boolean
    fromRole?: boolean
    toRole?: boolean
    actorEmail?: boolean
    actorName?: boolean
    createdAt?: boolean
  }

  export type RoleChangeAuditOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "targetId" | "fromRole" | "toRole" | "actorEmail" | "actorName" | "createdAt", ExtArgs["result"]["roleChangeAudit"]>
  export type RoleChangeAuditInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    target?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RoleChangeAuditIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    target?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RoleChangeAuditIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    target?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RoleChangeAuditPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoleChangeAudit"
    objects: {
      target: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      targetId: number
      fromRole: string
      toRole: string
      actorEmail: string
      actorName: string | null
      createdAt: Date
    }, ExtArgs["result"]["roleChangeAudit"]>
    composites: {}
  }

  type RoleChangeAuditGetPayload<S extends boolean | null | undefined | RoleChangeAuditDefaultArgs> = $Result.GetResult<Prisma.$RoleChangeAuditPayload, S>

  type RoleChangeAuditCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleChangeAuditFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleChangeAuditCountAggregateInputType | true
    }

  export interface RoleChangeAuditDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoleChangeAudit'], meta: { name: 'RoleChangeAudit' } }
    /**
     * Find zero or one RoleChangeAudit that matches the filter.
     * @param {RoleChangeAuditFindUniqueArgs} args - Arguments to find a RoleChangeAudit
     * @example
     * // Get one RoleChangeAudit
     * const roleChangeAudit = await prisma.roleChangeAudit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleChangeAuditFindUniqueArgs>(args: SelectSubset<T, RoleChangeAuditFindUniqueArgs<ExtArgs>>): Prisma__RoleChangeAuditClient<$Result.GetResult<Prisma.$RoleChangeAuditPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoleChangeAudit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleChangeAuditFindUniqueOrThrowArgs} args - Arguments to find a RoleChangeAudit
     * @example
     * // Get one RoleChangeAudit
     * const roleChangeAudit = await prisma.roleChangeAudit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleChangeAuditFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleChangeAuditFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleChangeAuditClient<$Result.GetResult<Prisma.$RoleChangeAuditPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoleChangeAudit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleChangeAuditFindFirstArgs} args - Arguments to find a RoleChangeAudit
     * @example
     * // Get one RoleChangeAudit
     * const roleChangeAudit = await prisma.roleChangeAudit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleChangeAuditFindFirstArgs>(args?: SelectSubset<T, RoleChangeAuditFindFirstArgs<ExtArgs>>): Prisma__RoleChangeAuditClient<$Result.GetResult<Prisma.$RoleChangeAuditPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoleChangeAudit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleChangeAuditFindFirstOrThrowArgs} args - Arguments to find a RoleChangeAudit
     * @example
     * // Get one RoleChangeAudit
     * const roleChangeAudit = await prisma.roleChangeAudit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleChangeAuditFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleChangeAuditFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleChangeAuditClient<$Result.GetResult<Prisma.$RoleChangeAuditPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoleChangeAudits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleChangeAuditFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoleChangeAudits
     * const roleChangeAudits = await prisma.roleChangeAudit.findMany()
     * 
     * // Get first 10 RoleChangeAudits
     * const roleChangeAudits = await prisma.roleChangeAudit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleChangeAuditWithIdOnly = await prisma.roleChangeAudit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleChangeAuditFindManyArgs>(args?: SelectSubset<T, RoleChangeAuditFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleChangeAuditPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoleChangeAudit.
     * @param {RoleChangeAuditCreateArgs} args - Arguments to create a RoleChangeAudit.
     * @example
     * // Create one RoleChangeAudit
     * const RoleChangeAudit = await prisma.roleChangeAudit.create({
     *   data: {
     *     // ... data to create a RoleChangeAudit
     *   }
     * })
     * 
     */
    create<T extends RoleChangeAuditCreateArgs>(args: SelectSubset<T, RoleChangeAuditCreateArgs<ExtArgs>>): Prisma__RoleChangeAuditClient<$Result.GetResult<Prisma.$RoleChangeAuditPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoleChangeAudits.
     * @param {RoleChangeAuditCreateManyArgs} args - Arguments to create many RoleChangeAudits.
     * @example
     * // Create many RoleChangeAudits
     * const roleChangeAudit = await prisma.roleChangeAudit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleChangeAuditCreateManyArgs>(args?: SelectSubset<T, RoleChangeAuditCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoleChangeAudits and returns the data saved in the database.
     * @param {RoleChangeAuditCreateManyAndReturnArgs} args - Arguments to create many RoleChangeAudits.
     * @example
     * // Create many RoleChangeAudits
     * const roleChangeAudit = await prisma.roleChangeAudit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoleChangeAudits and only return the `id`
     * const roleChangeAuditWithIdOnly = await prisma.roleChangeAudit.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleChangeAuditCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleChangeAuditCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleChangeAuditPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoleChangeAudit.
     * @param {RoleChangeAuditDeleteArgs} args - Arguments to delete one RoleChangeAudit.
     * @example
     * // Delete one RoleChangeAudit
     * const RoleChangeAudit = await prisma.roleChangeAudit.delete({
     *   where: {
     *     // ... filter to delete one RoleChangeAudit
     *   }
     * })
     * 
     */
    delete<T extends RoleChangeAuditDeleteArgs>(args: SelectSubset<T, RoleChangeAuditDeleteArgs<ExtArgs>>): Prisma__RoleChangeAuditClient<$Result.GetResult<Prisma.$RoleChangeAuditPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoleChangeAudit.
     * @param {RoleChangeAuditUpdateArgs} args - Arguments to update one RoleChangeAudit.
     * @example
     * // Update one RoleChangeAudit
     * const roleChangeAudit = await prisma.roleChangeAudit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleChangeAuditUpdateArgs>(args: SelectSubset<T, RoleChangeAuditUpdateArgs<ExtArgs>>): Prisma__RoleChangeAuditClient<$Result.GetResult<Prisma.$RoleChangeAuditPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoleChangeAudits.
     * @param {RoleChangeAuditDeleteManyArgs} args - Arguments to filter RoleChangeAudits to delete.
     * @example
     * // Delete a few RoleChangeAudits
     * const { count } = await prisma.roleChangeAudit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleChangeAuditDeleteManyArgs>(args?: SelectSubset<T, RoleChangeAuditDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoleChangeAudits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleChangeAuditUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoleChangeAudits
     * const roleChangeAudit = await prisma.roleChangeAudit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleChangeAuditUpdateManyArgs>(args: SelectSubset<T, RoleChangeAuditUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoleChangeAudits and returns the data updated in the database.
     * @param {RoleChangeAuditUpdateManyAndReturnArgs} args - Arguments to update many RoleChangeAudits.
     * @example
     * // Update many RoleChangeAudits
     * const roleChangeAudit = await prisma.roleChangeAudit.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoleChangeAudits and only return the `id`
     * const roleChangeAuditWithIdOnly = await prisma.roleChangeAudit.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleChangeAuditUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleChangeAuditUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleChangeAuditPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoleChangeAudit.
     * @param {RoleChangeAuditUpsertArgs} args - Arguments to update or create a RoleChangeAudit.
     * @example
     * // Update or create a RoleChangeAudit
     * const roleChangeAudit = await prisma.roleChangeAudit.upsert({
     *   create: {
     *     // ... data to create a RoleChangeAudit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoleChangeAudit we want to update
     *   }
     * })
     */
    upsert<T extends RoleChangeAuditUpsertArgs>(args: SelectSubset<T, RoleChangeAuditUpsertArgs<ExtArgs>>): Prisma__RoleChangeAuditClient<$Result.GetResult<Prisma.$RoleChangeAuditPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoleChangeAudits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleChangeAuditCountArgs} args - Arguments to filter RoleChangeAudits to count.
     * @example
     * // Count the number of RoleChangeAudits
     * const count = await prisma.roleChangeAudit.count({
     *   where: {
     *     // ... the filter for the RoleChangeAudits we want to count
     *   }
     * })
    **/
    count<T extends RoleChangeAuditCountArgs>(
      args?: Subset<T, RoleChangeAuditCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleChangeAuditCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoleChangeAudit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleChangeAuditAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleChangeAuditAggregateArgs>(args: Subset<T, RoleChangeAuditAggregateArgs>): Prisma.PrismaPromise<GetRoleChangeAuditAggregateType<T>>

    /**
     * Group by RoleChangeAudit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleChangeAuditGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleChangeAuditGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleChangeAuditGroupByArgs['orderBy'] }
        : { orderBy?: RoleChangeAuditGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleChangeAuditGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleChangeAuditGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoleChangeAudit model
   */
  readonly fields: RoleChangeAuditFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoleChangeAudit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleChangeAuditClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    target<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoleChangeAudit model
   */
  interface RoleChangeAuditFieldRefs {
    readonly id: FieldRef<"RoleChangeAudit", 'Int'>
    readonly targetId: FieldRef<"RoleChangeAudit", 'Int'>
    readonly fromRole: FieldRef<"RoleChangeAudit", 'String'>
    readonly toRole: FieldRef<"RoleChangeAudit", 'String'>
    readonly actorEmail: FieldRef<"RoleChangeAudit", 'String'>
    readonly actorName: FieldRef<"RoleChangeAudit", 'String'>
    readonly createdAt: FieldRef<"RoleChangeAudit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoleChangeAudit findUnique
   */
  export type RoleChangeAuditFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleChangeAudit
     */
    select?: RoleChangeAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleChangeAudit
     */
    omit?: RoleChangeAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleChangeAuditInclude<ExtArgs> | null
    /**
     * Filter, which RoleChangeAudit to fetch.
     */
    where: RoleChangeAuditWhereUniqueInput
  }

  /**
   * RoleChangeAudit findUniqueOrThrow
   */
  export type RoleChangeAuditFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleChangeAudit
     */
    select?: RoleChangeAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleChangeAudit
     */
    omit?: RoleChangeAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleChangeAuditInclude<ExtArgs> | null
    /**
     * Filter, which RoleChangeAudit to fetch.
     */
    where: RoleChangeAuditWhereUniqueInput
  }

  /**
   * RoleChangeAudit findFirst
   */
  export type RoleChangeAuditFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleChangeAudit
     */
    select?: RoleChangeAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleChangeAudit
     */
    omit?: RoleChangeAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleChangeAuditInclude<ExtArgs> | null
    /**
     * Filter, which RoleChangeAudit to fetch.
     */
    where?: RoleChangeAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleChangeAudits to fetch.
     */
    orderBy?: RoleChangeAuditOrderByWithRelationInput | RoleChangeAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoleChangeAudits.
     */
    cursor?: RoleChangeAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleChangeAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleChangeAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleChangeAudits.
     */
    distinct?: RoleChangeAuditScalarFieldEnum | RoleChangeAuditScalarFieldEnum[]
  }

  /**
   * RoleChangeAudit findFirstOrThrow
   */
  export type RoleChangeAuditFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleChangeAudit
     */
    select?: RoleChangeAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleChangeAudit
     */
    omit?: RoleChangeAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleChangeAuditInclude<ExtArgs> | null
    /**
     * Filter, which RoleChangeAudit to fetch.
     */
    where?: RoleChangeAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleChangeAudits to fetch.
     */
    orderBy?: RoleChangeAuditOrderByWithRelationInput | RoleChangeAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoleChangeAudits.
     */
    cursor?: RoleChangeAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleChangeAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleChangeAudits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleChangeAudits.
     */
    distinct?: RoleChangeAuditScalarFieldEnum | RoleChangeAuditScalarFieldEnum[]
  }

  /**
   * RoleChangeAudit findMany
   */
  export type RoleChangeAuditFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleChangeAudit
     */
    select?: RoleChangeAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleChangeAudit
     */
    omit?: RoleChangeAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleChangeAuditInclude<ExtArgs> | null
    /**
     * Filter, which RoleChangeAudits to fetch.
     */
    where?: RoleChangeAuditWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleChangeAudits to fetch.
     */
    orderBy?: RoleChangeAuditOrderByWithRelationInput | RoleChangeAuditOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoleChangeAudits.
     */
    cursor?: RoleChangeAuditWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleChangeAudits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleChangeAudits.
     */
    skip?: number
    distinct?: RoleChangeAuditScalarFieldEnum | RoleChangeAuditScalarFieldEnum[]
  }

  /**
   * RoleChangeAudit create
   */
  export type RoleChangeAuditCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleChangeAudit
     */
    select?: RoleChangeAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleChangeAudit
     */
    omit?: RoleChangeAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleChangeAuditInclude<ExtArgs> | null
    /**
     * The data needed to create a RoleChangeAudit.
     */
    data: XOR<RoleChangeAuditCreateInput, RoleChangeAuditUncheckedCreateInput>
  }

  /**
   * RoleChangeAudit createMany
   */
  export type RoleChangeAuditCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoleChangeAudits.
     */
    data: RoleChangeAuditCreateManyInput | RoleChangeAuditCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoleChangeAudit createManyAndReturn
   */
  export type RoleChangeAuditCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleChangeAudit
     */
    select?: RoleChangeAuditSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoleChangeAudit
     */
    omit?: RoleChangeAuditOmit<ExtArgs> | null
    /**
     * The data used to create many RoleChangeAudits.
     */
    data: RoleChangeAuditCreateManyInput | RoleChangeAuditCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleChangeAuditIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoleChangeAudit update
   */
  export type RoleChangeAuditUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleChangeAudit
     */
    select?: RoleChangeAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleChangeAudit
     */
    omit?: RoleChangeAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleChangeAuditInclude<ExtArgs> | null
    /**
     * The data needed to update a RoleChangeAudit.
     */
    data: XOR<RoleChangeAuditUpdateInput, RoleChangeAuditUncheckedUpdateInput>
    /**
     * Choose, which RoleChangeAudit to update.
     */
    where: RoleChangeAuditWhereUniqueInput
  }

  /**
   * RoleChangeAudit updateMany
   */
  export type RoleChangeAuditUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoleChangeAudits.
     */
    data: XOR<RoleChangeAuditUpdateManyMutationInput, RoleChangeAuditUncheckedUpdateManyInput>
    /**
     * Filter which RoleChangeAudits to update
     */
    where?: RoleChangeAuditWhereInput
    /**
     * Limit how many RoleChangeAudits to update.
     */
    limit?: number
  }

  /**
   * RoleChangeAudit updateManyAndReturn
   */
  export type RoleChangeAuditUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleChangeAudit
     */
    select?: RoleChangeAuditSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoleChangeAudit
     */
    omit?: RoleChangeAuditOmit<ExtArgs> | null
    /**
     * The data used to update RoleChangeAudits.
     */
    data: XOR<RoleChangeAuditUpdateManyMutationInput, RoleChangeAuditUncheckedUpdateManyInput>
    /**
     * Filter which RoleChangeAudits to update
     */
    where?: RoleChangeAuditWhereInput
    /**
     * Limit how many RoleChangeAudits to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleChangeAuditIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoleChangeAudit upsert
   */
  export type RoleChangeAuditUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleChangeAudit
     */
    select?: RoleChangeAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleChangeAudit
     */
    omit?: RoleChangeAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleChangeAuditInclude<ExtArgs> | null
    /**
     * The filter to search for the RoleChangeAudit to update in case it exists.
     */
    where: RoleChangeAuditWhereUniqueInput
    /**
     * In case the RoleChangeAudit found by the `where` argument doesn't exist, create a new RoleChangeAudit with this data.
     */
    create: XOR<RoleChangeAuditCreateInput, RoleChangeAuditUncheckedCreateInput>
    /**
     * In case the RoleChangeAudit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleChangeAuditUpdateInput, RoleChangeAuditUncheckedUpdateInput>
  }

  /**
   * RoleChangeAudit delete
   */
  export type RoleChangeAuditDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleChangeAudit
     */
    select?: RoleChangeAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleChangeAudit
     */
    omit?: RoleChangeAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleChangeAuditInclude<ExtArgs> | null
    /**
     * Filter which RoleChangeAudit to delete.
     */
    where: RoleChangeAuditWhereUniqueInput
  }

  /**
   * RoleChangeAudit deleteMany
   */
  export type RoleChangeAuditDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoleChangeAudits to delete
     */
    where?: RoleChangeAuditWhereInput
    /**
     * Limit how many RoleChangeAudits to delete.
     */
    limit?: number
  }

  /**
   * RoleChangeAudit without action
   */
  export type RoleChangeAuditDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleChangeAudit
     */
    select?: RoleChangeAuditSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleChangeAudit
     */
    omit?: RoleChangeAuditOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleChangeAuditInclude<ExtArgs> | null
  }


  /**
   * Model PasswordResetCode
   */

  export type AggregatePasswordResetCode = {
    _count: PasswordResetCodeCountAggregateOutputType | null
    _avg: PasswordResetCodeAvgAggregateOutputType | null
    _sum: PasswordResetCodeSumAggregateOutputType | null
    _min: PasswordResetCodeMinAggregateOutputType | null
    _max: PasswordResetCodeMaxAggregateOutputType | null
  }

  export type PasswordResetCodeAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    attempts: number | null
  }

  export type PasswordResetCodeSumAggregateOutputType = {
    id: number | null
    userId: number | null
    attempts: number | null
  }

  export type PasswordResetCodeMinAggregateOutputType = {
    id: number | null
    userId: number | null
    email: string | null
    codeHash: string | null
    salt: string | null
    attempts: number | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetCodeMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    email: string | null
    codeHash: string | null
    salt: string | null
    attempts: number | null
    expiresAt: Date | null
    usedAt: Date | null
    createdAt: Date | null
  }

  export type PasswordResetCodeCountAggregateOutputType = {
    id: number
    userId: number
    email: number
    codeHash: number
    salt: number
    attempts: number
    expiresAt: number
    usedAt: number
    createdAt: number
    _all: number
  }


  export type PasswordResetCodeAvgAggregateInputType = {
    id?: true
    userId?: true
    attempts?: true
  }

  export type PasswordResetCodeSumAggregateInputType = {
    id?: true
    userId?: true
    attempts?: true
  }

  export type PasswordResetCodeMinAggregateInputType = {
    id?: true
    userId?: true
    email?: true
    codeHash?: true
    salt?: true
    attempts?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
  }

  export type PasswordResetCodeMaxAggregateInputType = {
    id?: true
    userId?: true
    email?: true
    codeHash?: true
    salt?: true
    attempts?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
  }

  export type PasswordResetCodeCountAggregateInputType = {
    id?: true
    userId?: true
    email?: true
    codeHash?: true
    salt?: true
    attempts?: true
    expiresAt?: true
    usedAt?: true
    createdAt?: true
    _all?: true
  }

  export type PasswordResetCodeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetCode to aggregate.
     */
    where?: PasswordResetCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetCodes to fetch.
     */
    orderBy?: PasswordResetCodeOrderByWithRelationInput | PasswordResetCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordResetCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordResetCodes
    **/
    _count?: true | PasswordResetCodeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PasswordResetCodeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PasswordResetCodeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordResetCodeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordResetCodeMaxAggregateInputType
  }

  export type GetPasswordResetCodeAggregateType<T extends PasswordResetCodeAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordResetCode]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordResetCode[P]>
      : GetScalarType<T[P], AggregatePasswordResetCode[P]>
  }




  export type PasswordResetCodeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetCodeWhereInput
    orderBy?: PasswordResetCodeOrderByWithAggregationInput | PasswordResetCodeOrderByWithAggregationInput[]
    by: PasswordResetCodeScalarFieldEnum[] | PasswordResetCodeScalarFieldEnum
    having?: PasswordResetCodeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordResetCodeCountAggregateInputType | true
    _avg?: PasswordResetCodeAvgAggregateInputType
    _sum?: PasswordResetCodeSumAggregateInputType
    _min?: PasswordResetCodeMinAggregateInputType
    _max?: PasswordResetCodeMaxAggregateInputType
  }

  export type PasswordResetCodeGroupByOutputType = {
    id: number
    userId: number
    email: string
    codeHash: string
    salt: string
    attempts: number
    expiresAt: Date
    usedAt: Date | null
    createdAt: Date
    _count: PasswordResetCodeCountAggregateOutputType | null
    _avg: PasswordResetCodeAvgAggregateOutputType | null
    _sum: PasswordResetCodeSumAggregateOutputType | null
    _min: PasswordResetCodeMinAggregateOutputType | null
    _max: PasswordResetCodeMaxAggregateOutputType | null
  }

  type GetPasswordResetCodeGroupByPayload<T extends PasswordResetCodeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetCodeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordResetCodeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordResetCodeGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordResetCodeGroupByOutputType[P]>
        }
      >
    >


  export type PasswordResetCodeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    email?: boolean
    codeHash?: boolean
    salt?: boolean
    attempts?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetCode"]>

  export type PasswordResetCodeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    email?: boolean
    codeHash?: boolean
    salt?: boolean
    attempts?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetCode"]>

  export type PasswordResetCodeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    email?: boolean
    codeHash?: boolean
    salt?: boolean
    attempts?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetCode"]>

  export type PasswordResetCodeSelectScalar = {
    id?: boolean
    userId?: boolean
    email?: boolean
    codeHash?: boolean
    salt?: boolean
    attempts?: boolean
    expiresAt?: boolean
    usedAt?: boolean
    createdAt?: boolean
  }

  export type PasswordResetCodeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "email" | "codeHash" | "salt" | "attempts" | "expiresAt" | "usedAt" | "createdAt", ExtArgs["result"]["passwordResetCode"]>
  export type PasswordResetCodeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PasswordResetCodeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PasswordResetCodeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PasswordResetCodePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordResetCode"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      email: string
      codeHash: string
      salt: string
      attempts: number
      expiresAt: Date
      usedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["passwordResetCode"]>
    composites: {}
  }

  type PasswordResetCodeGetPayload<S extends boolean | null | undefined | PasswordResetCodeDefaultArgs> = $Result.GetResult<Prisma.$PasswordResetCodePayload, S>

  type PasswordResetCodeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasswordResetCodeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasswordResetCodeCountAggregateInputType | true
    }

  export interface PasswordResetCodeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordResetCode'], meta: { name: 'PasswordResetCode' } }
    /**
     * Find zero or one PasswordResetCode that matches the filter.
     * @param {PasswordResetCodeFindUniqueArgs} args - Arguments to find a PasswordResetCode
     * @example
     * // Get one PasswordResetCode
     * const passwordResetCode = await prisma.passwordResetCode.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetCodeFindUniqueArgs>(args: SelectSubset<T, PasswordResetCodeFindUniqueArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PasswordResetCode that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasswordResetCodeFindUniqueOrThrowArgs} args - Arguments to find a PasswordResetCode
     * @example
     * // Get one PasswordResetCode
     * const passwordResetCode = await prisma.passwordResetCode.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetCodeFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordResetCodeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetCode that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeFindFirstArgs} args - Arguments to find a PasswordResetCode
     * @example
     * // Get one PasswordResetCode
     * const passwordResetCode = await prisma.passwordResetCode.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetCodeFindFirstArgs>(args?: SelectSubset<T, PasswordResetCodeFindFirstArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetCode that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeFindFirstOrThrowArgs} args - Arguments to find a PasswordResetCode
     * @example
     * // Get one PasswordResetCode
     * const passwordResetCode = await prisma.passwordResetCode.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetCodeFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordResetCodeFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PasswordResetCodes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResetCodes
     * const passwordResetCodes = await prisma.passwordResetCode.findMany()
     * 
     * // Get first 10 PasswordResetCodes
     * const passwordResetCodes = await prisma.passwordResetCode.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordResetCodeWithIdOnly = await prisma.passwordResetCode.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordResetCodeFindManyArgs>(args?: SelectSubset<T, PasswordResetCodeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PasswordResetCode.
     * @param {PasswordResetCodeCreateArgs} args - Arguments to create a PasswordResetCode.
     * @example
     * // Create one PasswordResetCode
     * const PasswordResetCode = await prisma.passwordResetCode.create({
     *   data: {
     *     // ... data to create a PasswordResetCode
     *   }
     * })
     * 
     */
    create<T extends PasswordResetCodeCreateArgs>(args: SelectSubset<T, PasswordResetCodeCreateArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PasswordResetCodes.
     * @param {PasswordResetCodeCreateManyArgs} args - Arguments to create many PasswordResetCodes.
     * @example
     * // Create many PasswordResetCodes
     * const passwordResetCode = await prisma.passwordResetCode.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordResetCodeCreateManyArgs>(args?: SelectSubset<T, PasswordResetCodeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasswordResetCodes and returns the data saved in the database.
     * @param {PasswordResetCodeCreateManyAndReturnArgs} args - Arguments to create many PasswordResetCodes.
     * @example
     * // Create many PasswordResetCodes
     * const passwordResetCode = await prisma.passwordResetCode.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasswordResetCodes and only return the `id`
     * const passwordResetCodeWithIdOnly = await prisma.passwordResetCode.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasswordResetCodeCreateManyAndReturnArgs>(args?: SelectSubset<T, PasswordResetCodeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PasswordResetCode.
     * @param {PasswordResetCodeDeleteArgs} args - Arguments to delete one PasswordResetCode.
     * @example
     * // Delete one PasswordResetCode
     * const PasswordResetCode = await prisma.passwordResetCode.delete({
     *   where: {
     *     // ... filter to delete one PasswordResetCode
     *   }
     * })
     * 
     */
    delete<T extends PasswordResetCodeDeleteArgs>(args: SelectSubset<T, PasswordResetCodeDeleteArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PasswordResetCode.
     * @param {PasswordResetCodeUpdateArgs} args - Arguments to update one PasswordResetCode.
     * @example
     * // Update one PasswordResetCode
     * const passwordResetCode = await prisma.passwordResetCode.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordResetCodeUpdateArgs>(args: SelectSubset<T, PasswordResetCodeUpdateArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PasswordResetCodes.
     * @param {PasswordResetCodeDeleteManyArgs} args - Arguments to filter PasswordResetCodes to delete.
     * @example
     * // Delete a few PasswordResetCodes
     * const { count } = await prisma.passwordResetCode.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordResetCodeDeleteManyArgs>(args?: SelectSubset<T, PasswordResetCodeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResetCodes
     * const passwordResetCode = await prisma.passwordResetCode.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordResetCodeUpdateManyArgs>(args: SelectSubset<T, PasswordResetCodeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetCodes and returns the data updated in the database.
     * @param {PasswordResetCodeUpdateManyAndReturnArgs} args - Arguments to update many PasswordResetCodes.
     * @example
     * // Update many PasswordResetCodes
     * const passwordResetCode = await prisma.passwordResetCode.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PasswordResetCodes and only return the `id`
     * const passwordResetCodeWithIdOnly = await prisma.passwordResetCode.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PasswordResetCodeUpdateManyAndReturnArgs>(args: SelectSubset<T, PasswordResetCodeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PasswordResetCode.
     * @param {PasswordResetCodeUpsertArgs} args - Arguments to update or create a PasswordResetCode.
     * @example
     * // Update or create a PasswordResetCode
     * const passwordResetCode = await prisma.passwordResetCode.upsert({
     *   create: {
     *     // ... data to create a PasswordResetCode
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordResetCode we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetCodeUpsertArgs>(args: SelectSubset<T, PasswordResetCodeUpsertArgs<ExtArgs>>): Prisma__PasswordResetCodeClient<$Result.GetResult<Prisma.$PasswordResetCodePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PasswordResetCodes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeCountArgs} args - Arguments to filter PasswordResetCodes to count.
     * @example
     * // Count the number of PasswordResetCodes
     * const count = await prisma.passwordResetCode.count({
     *   where: {
     *     // ... the filter for the PasswordResetCodes we want to count
     *   }
     * })
    **/
    count<T extends PasswordResetCodeCountArgs>(
      args?: Subset<T, PasswordResetCodeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordResetCodeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordResetCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasswordResetCodeAggregateArgs>(args: Subset<T, PasswordResetCodeAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetCodeAggregateType<T>>

    /**
     * Group by PasswordResetCode.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetCodeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasswordResetCodeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetCodeGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetCodeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasswordResetCodeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetCodeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordResetCode model
   */
  readonly fields: PasswordResetCodeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordResetCode.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetCodeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PasswordResetCode model
   */
  interface PasswordResetCodeFieldRefs {
    readonly id: FieldRef<"PasswordResetCode", 'Int'>
    readonly userId: FieldRef<"PasswordResetCode", 'Int'>
    readonly email: FieldRef<"PasswordResetCode", 'String'>
    readonly codeHash: FieldRef<"PasswordResetCode", 'String'>
    readonly salt: FieldRef<"PasswordResetCode", 'String'>
    readonly attempts: FieldRef<"PasswordResetCode", 'Int'>
    readonly expiresAt: FieldRef<"PasswordResetCode", 'DateTime'>
    readonly usedAt: FieldRef<"PasswordResetCode", 'DateTime'>
    readonly createdAt: FieldRef<"PasswordResetCode", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasswordResetCode findUnique
   */
  export type PasswordResetCodeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetCodeInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetCode to fetch.
     */
    where: PasswordResetCodeWhereUniqueInput
  }

  /**
   * PasswordResetCode findUniqueOrThrow
   */
  export type PasswordResetCodeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetCodeInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetCode to fetch.
     */
    where: PasswordResetCodeWhereUniqueInput
  }

  /**
   * PasswordResetCode findFirst
   */
  export type PasswordResetCodeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetCodeInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetCode to fetch.
     */
    where?: PasswordResetCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetCodes to fetch.
     */
    orderBy?: PasswordResetCodeOrderByWithRelationInput | PasswordResetCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetCodes.
     */
    cursor?: PasswordResetCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetCodes.
     */
    distinct?: PasswordResetCodeScalarFieldEnum | PasswordResetCodeScalarFieldEnum[]
  }

  /**
   * PasswordResetCode findFirstOrThrow
   */
  export type PasswordResetCodeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetCodeInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetCode to fetch.
     */
    where?: PasswordResetCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetCodes to fetch.
     */
    orderBy?: PasswordResetCodeOrderByWithRelationInput | PasswordResetCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetCodes.
     */
    cursor?: PasswordResetCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetCodes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetCodes.
     */
    distinct?: PasswordResetCodeScalarFieldEnum | PasswordResetCodeScalarFieldEnum[]
  }

  /**
   * PasswordResetCode findMany
   */
  export type PasswordResetCodeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetCodeInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetCodes to fetch.
     */
    where?: PasswordResetCodeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetCodes to fetch.
     */
    orderBy?: PasswordResetCodeOrderByWithRelationInput | PasswordResetCodeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordResetCodes.
     */
    cursor?: PasswordResetCodeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetCodes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetCodes.
     */
    skip?: number
    distinct?: PasswordResetCodeScalarFieldEnum | PasswordResetCodeScalarFieldEnum[]
  }

  /**
   * PasswordResetCode create
   */
  export type PasswordResetCodeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetCodeInclude<ExtArgs> | null
    /**
     * The data needed to create a PasswordResetCode.
     */
    data: XOR<PasswordResetCodeCreateInput, PasswordResetCodeUncheckedCreateInput>
  }

  /**
   * PasswordResetCode createMany
   */
  export type PasswordResetCodeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordResetCodes.
     */
    data: PasswordResetCodeCreateManyInput | PasswordResetCodeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordResetCode createManyAndReturn
   */
  export type PasswordResetCodeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * The data used to create many PasswordResetCodes.
     */
    data: PasswordResetCodeCreateManyInput | PasswordResetCodeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetCodeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasswordResetCode update
   */
  export type PasswordResetCodeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetCodeInclude<ExtArgs> | null
    /**
     * The data needed to update a PasswordResetCode.
     */
    data: XOR<PasswordResetCodeUpdateInput, PasswordResetCodeUncheckedUpdateInput>
    /**
     * Choose, which PasswordResetCode to update.
     */
    where: PasswordResetCodeWhereUniqueInput
  }

  /**
   * PasswordResetCode updateMany
   */
  export type PasswordResetCodeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordResetCodes.
     */
    data: XOR<PasswordResetCodeUpdateManyMutationInput, PasswordResetCodeUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetCodes to update
     */
    where?: PasswordResetCodeWhereInput
    /**
     * Limit how many PasswordResetCodes to update.
     */
    limit?: number
  }

  /**
   * PasswordResetCode updateManyAndReturn
   */
  export type PasswordResetCodeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * The data used to update PasswordResetCodes.
     */
    data: XOR<PasswordResetCodeUpdateManyMutationInput, PasswordResetCodeUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetCodes to update
     */
    where?: PasswordResetCodeWhereInput
    /**
     * Limit how many PasswordResetCodes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetCodeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasswordResetCode upsert
   */
  export type PasswordResetCodeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetCodeInclude<ExtArgs> | null
    /**
     * The filter to search for the PasswordResetCode to update in case it exists.
     */
    where: PasswordResetCodeWhereUniqueInput
    /**
     * In case the PasswordResetCode found by the `where` argument doesn't exist, create a new PasswordResetCode with this data.
     */
    create: XOR<PasswordResetCodeCreateInput, PasswordResetCodeUncheckedCreateInput>
    /**
     * In case the PasswordResetCode was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordResetCodeUpdateInput, PasswordResetCodeUncheckedUpdateInput>
  }

  /**
   * PasswordResetCode delete
   */
  export type PasswordResetCodeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetCodeInclude<ExtArgs> | null
    /**
     * Filter which PasswordResetCode to delete.
     */
    where: PasswordResetCodeWhereUniqueInput
  }

  /**
   * PasswordResetCode deleteMany
   */
  export type PasswordResetCodeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetCodes to delete
     */
    where?: PasswordResetCodeWhereInput
    /**
     * Limit how many PasswordResetCodes to delete.
     */
    limit?: number
  }

  /**
   * PasswordResetCode without action
   */
  export type PasswordResetCodeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetCode
     */
    select?: PasswordResetCodeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetCode
     */
    omit?: PasswordResetCodeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetCodeInclude<ExtArgs> | null
  }


  /**
   * Model PurchasingLookup
   */

  export type AggregatePurchasingLookup = {
    _count: PurchasingLookupCountAggregateOutputType | null
    _avg: PurchasingLookupAvgAggregateOutputType | null
    _sum: PurchasingLookupSumAggregateOutputType | null
    _min: PurchasingLookupMinAggregateOutputType | null
    _max: PurchasingLookupMaxAggregateOutputType | null
  }

  export type PurchasingLookupAvgAggregateOutputType = {
    id: number | null
  }

  export type PurchasingLookupSumAggregateOutputType = {
    id: number | null
  }

  export type PurchasingLookupMinAggregateOutputType = {
    id: number | null
    kind: string | null
    value: string | null
    createdAt: Date | null
  }

  export type PurchasingLookupMaxAggregateOutputType = {
    id: number | null
    kind: string | null
    value: string | null
    createdAt: Date | null
  }

  export type PurchasingLookupCountAggregateOutputType = {
    id: number
    kind: number
    value: number
    createdAt: number
    _all: number
  }


  export type PurchasingLookupAvgAggregateInputType = {
    id?: true
  }

  export type PurchasingLookupSumAggregateInputType = {
    id?: true
  }

  export type PurchasingLookupMinAggregateInputType = {
    id?: true
    kind?: true
    value?: true
    createdAt?: true
  }

  export type PurchasingLookupMaxAggregateInputType = {
    id?: true
    kind?: true
    value?: true
    createdAt?: true
  }

  export type PurchasingLookupCountAggregateInputType = {
    id?: true
    kind?: true
    value?: true
    createdAt?: true
    _all?: true
  }

  export type PurchasingLookupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchasingLookup to aggregate.
     */
    where?: PurchasingLookupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchasingLookups to fetch.
     */
    orderBy?: PurchasingLookupOrderByWithRelationInput | PurchasingLookupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchasingLookupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchasingLookups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchasingLookups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PurchasingLookups
    **/
    _count?: true | PurchasingLookupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PurchasingLookupAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PurchasingLookupSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchasingLookupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchasingLookupMaxAggregateInputType
  }

  export type GetPurchasingLookupAggregateType<T extends PurchasingLookupAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchasingLookup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchasingLookup[P]>
      : GetScalarType<T[P], AggregatePurchasingLookup[P]>
  }




  export type PurchasingLookupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchasingLookupWhereInput
    orderBy?: PurchasingLookupOrderByWithAggregationInput | PurchasingLookupOrderByWithAggregationInput[]
    by: PurchasingLookupScalarFieldEnum[] | PurchasingLookupScalarFieldEnum
    having?: PurchasingLookupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchasingLookupCountAggregateInputType | true
    _avg?: PurchasingLookupAvgAggregateInputType
    _sum?: PurchasingLookupSumAggregateInputType
    _min?: PurchasingLookupMinAggregateInputType
    _max?: PurchasingLookupMaxAggregateInputType
  }

  export type PurchasingLookupGroupByOutputType = {
    id: number
    kind: string
    value: string
    createdAt: Date
    _count: PurchasingLookupCountAggregateOutputType | null
    _avg: PurchasingLookupAvgAggregateOutputType | null
    _sum: PurchasingLookupSumAggregateOutputType | null
    _min: PurchasingLookupMinAggregateOutputType | null
    _max: PurchasingLookupMaxAggregateOutputType | null
  }

  type GetPurchasingLookupGroupByPayload<T extends PurchasingLookupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchasingLookupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchasingLookupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchasingLookupGroupByOutputType[P]>
            : GetScalarType<T[P], PurchasingLookupGroupByOutputType[P]>
        }
      >
    >


  export type PurchasingLookupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    value?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["purchasingLookup"]>

  export type PurchasingLookupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    value?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["purchasingLookup"]>

  export type PurchasingLookupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    value?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["purchasingLookup"]>

  export type PurchasingLookupSelectScalar = {
    id?: boolean
    kind?: boolean
    value?: boolean
    createdAt?: boolean
  }

  export type PurchasingLookupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kind" | "value" | "createdAt", ExtArgs["result"]["purchasingLookup"]>

  export type $PurchasingLookupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PurchasingLookup"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      kind: string
      value: string
      createdAt: Date
    }, ExtArgs["result"]["purchasingLookup"]>
    composites: {}
  }

  type PurchasingLookupGetPayload<S extends boolean | null | undefined | PurchasingLookupDefaultArgs> = $Result.GetResult<Prisma.$PurchasingLookupPayload, S>

  type PurchasingLookupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PurchasingLookupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PurchasingLookupCountAggregateInputType | true
    }

  export interface PurchasingLookupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PurchasingLookup'], meta: { name: 'PurchasingLookup' } }
    /**
     * Find zero or one PurchasingLookup that matches the filter.
     * @param {PurchasingLookupFindUniqueArgs} args - Arguments to find a PurchasingLookup
     * @example
     * // Get one PurchasingLookup
     * const purchasingLookup = await prisma.purchasingLookup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchasingLookupFindUniqueArgs>(args: SelectSubset<T, PurchasingLookupFindUniqueArgs<ExtArgs>>): Prisma__PurchasingLookupClient<$Result.GetResult<Prisma.$PurchasingLookupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PurchasingLookup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PurchasingLookupFindUniqueOrThrowArgs} args - Arguments to find a PurchasingLookup
     * @example
     * // Get one PurchasingLookup
     * const purchasingLookup = await prisma.purchasingLookup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchasingLookupFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchasingLookupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchasingLookupClient<$Result.GetResult<Prisma.$PurchasingLookupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchasingLookup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchasingLookupFindFirstArgs} args - Arguments to find a PurchasingLookup
     * @example
     * // Get one PurchasingLookup
     * const purchasingLookup = await prisma.purchasingLookup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchasingLookupFindFirstArgs>(args?: SelectSubset<T, PurchasingLookupFindFirstArgs<ExtArgs>>): Prisma__PurchasingLookupClient<$Result.GetResult<Prisma.$PurchasingLookupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchasingLookup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchasingLookupFindFirstOrThrowArgs} args - Arguments to find a PurchasingLookup
     * @example
     * // Get one PurchasingLookup
     * const purchasingLookup = await prisma.purchasingLookup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchasingLookupFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchasingLookupFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchasingLookupClient<$Result.GetResult<Prisma.$PurchasingLookupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PurchasingLookups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchasingLookupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PurchasingLookups
     * const purchasingLookups = await prisma.purchasingLookup.findMany()
     * 
     * // Get first 10 PurchasingLookups
     * const purchasingLookups = await prisma.purchasingLookup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const purchasingLookupWithIdOnly = await prisma.purchasingLookup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PurchasingLookupFindManyArgs>(args?: SelectSubset<T, PurchasingLookupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchasingLookupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PurchasingLookup.
     * @param {PurchasingLookupCreateArgs} args - Arguments to create a PurchasingLookup.
     * @example
     * // Create one PurchasingLookup
     * const PurchasingLookup = await prisma.purchasingLookup.create({
     *   data: {
     *     // ... data to create a PurchasingLookup
     *   }
     * })
     * 
     */
    create<T extends PurchasingLookupCreateArgs>(args: SelectSubset<T, PurchasingLookupCreateArgs<ExtArgs>>): Prisma__PurchasingLookupClient<$Result.GetResult<Prisma.$PurchasingLookupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PurchasingLookups.
     * @param {PurchasingLookupCreateManyArgs} args - Arguments to create many PurchasingLookups.
     * @example
     * // Create many PurchasingLookups
     * const purchasingLookup = await prisma.purchasingLookup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchasingLookupCreateManyArgs>(args?: SelectSubset<T, PurchasingLookupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PurchasingLookups and returns the data saved in the database.
     * @param {PurchasingLookupCreateManyAndReturnArgs} args - Arguments to create many PurchasingLookups.
     * @example
     * // Create many PurchasingLookups
     * const purchasingLookup = await prisma.purchasingLookup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PurchasingLookups and only return the `id`
     * const purchasingLookupWithIdOnly = await prisma.purchasingLookup.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PurchasingLookupCreateManyAndReturnArgs>(args?: SelectSubset<T, PurchasingLookupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchasingLookupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PurchasingLookup.
     * @param {PurchasingLookupDeleteArgs} args - Arguments to delete one PurchasingLookup.
     * @example
     * // Delete one PurchasingLookup
     * const PurchasingLookup = await prisma.purchasingLookup.delete({
     *   where: {
     *     // ... filter to delete one PurchasingLookup
     *   }
     * })
     * 
     */
    delete<T extends PurchasingLookupDeleteArgs>(args: SelectSubset<T, PurchasingLookupDeleteArgs<ExtArgs>>): Prisma__PurchasingLookupClient<$Result.GetResult<Prisma.$PurchasingLookupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PurchasingLookup.
     * @param {PurchasingLookupUpdateArgs} args - Arguments to update one PurchasingLookup.
     * @example
     * // Update one PurchasingLookup
     * const purchasingLookup = await prisma.purchasingLookup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchasingLookupUpdateArgs>(args: SelectSubset<T, PurchasingLookupUpdateArgs<ExtArgs>>): Prisma__PurchasingLookupClient<$Result.GetResult<Prisma.$PurchasingLookupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PurchasingLookups.
     * @param {PurchasingLookupDeleteManyArgs} args - Arguments to filter PurchasingLookups to delete.
     * @example
     * // Delete a few PurchasingLookups
     * const { count } = await prisma.purchasingLookup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchasingLookupDeleteManyArgs>(args?: SelectSubset<T, PurchasingLookupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchasingLookups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchasingLookupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PurchasingLookups
     * const purchasingLookup = await prisma.purchasingLookup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchasingLookupUpdateManyArgs>(args: SelectSubset<T, PurchasingLookupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchasingLookups and returns the data updated in the database.
     * @param {PurchasingLookupUpdateManyAndReturnArgs} args - Arguments to update many PurchasingLookups.
     * @example
     * // Update many PurchasingLookups
     * const purchasingLookup = await prisma.purchasingLookup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PurchasingLookups and only return the `id`
     * const purchasingLookupWithIdOnly = await prisma.purchasingLookup.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PurchasingLookupUpdateManyAndReturnArgs>(args: SelectSubset<T, PurchasingLookupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchasingLookupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PurchasingLookup.
     * @param {PurchasingLookupUpsertArgs} args - Arguments to update or create a PurchasingLookup.
     * @example
     * // Update or create a PurchasingLookup
     * const purchasingLookup = await prisma.purchasingLookup.upsert({
     *   create: {
     *     // ... data to create a PurchasingLookup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PurchasingLookup we want to update
     *   }
     * })
     */
    upsert<T extends PurchasingLookupUpsertArgs>(args: SelectSubset<T, PurchasingLookupUpsertArgs<ExtArgs>>): Prisma__PurchasingLookupClient<$Result.GetResult<Prisma.$PurchasingLookupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PurchasingLookups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchasingLookupCountArgs} args - Arguments to filter PurchasingLookups to count.
     * @example
     * // Count the number of PurchasingLookups
     * const count = await prisma.purchasingLookup.count({
     *   where: {
     *     // ... the filter for the PurchasingLookups we want to count
     *   }
     * })
    **/
    count<T extends PurchasingLookupCountArgs>(
      args?: Subset<T, PurchasingLookupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchasingLookupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PurchasingLookup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchasingLookupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchasingLookupAggregateArgs>(args: Subset<T, PurchasingLookupAggregateArgs>): Prisma.PrismaPromise<GetPurchasingLookupAggregateType<T>>

    /**
     * Group by PurchasingLookup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchasingLookupGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchasingLookupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchasingLookupGroupByArgs['orderBy'] }
        : { orderBy?: PurchasingLookupGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchasingLookupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchasingLookupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PurchasingLookup model
   */
  readonly fields: PurchasingLookupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PurchasingLookup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchasingLookupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PurchasingLookup model
   */
  interface PurchasingLookupFieldRefs {
    readonly id: FieldRef<"PurchasingLookup", 'Int'>
    readonly kind: FieldRef<"PurchasingLookup", 'String'>
    readonly value: FieldRef<"PurchasingLookup", 'String'>
    readonly createdAt: FieldRef<"PurchasingLookup", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PurchasingLookup findUnique
   */
  export type PurchasingLookupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchasingLookup
     */
    select?: PurchasingLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchasingLookup
     */
    omit?: PurchasingLookupOmit<ExtArgs> | null
    /**
     * Filter, which PurchasingLookup to fetch.
     */
    where: PurchasingLookupWhereUniqueInput
  }

  /**
   * PurchasingLookup findUniqueOrThrow
   */
  export type PurchasingLookupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchasingLookup
     */
    select?: PurchasingLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchasingLookup
     */
    omit?: PurchasingLookupOmit<ExtArgs> | null
    /**
     * Filter, which PurchasingLookup to fetch.
     */
    where: PurchasingLookupWhereUniqueInput
  }

  /**
   * PurchasingLookup findFirst
   */
  export type PurchasingLookupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchasingLookup
     */
    select?: PurchasingLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchasingLookup
     */
    omit?: PurchasingLookupOmit<ExtArgs> | null
    /**
     * Filter, which PurchasingLookup to fetch.
     */
    where?: PurchasingLookupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchasingLookups to fetch.
     */
    orderBy?: PurchasingLookupOrderByWithRelationInput | PurchasingLookupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchasingLookups.
     */
    cursor?: PurchasingLookupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchasingLookups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchasingLookups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchasingLookups.
     */
    distinct?: PurchasingLookupScalarFieldEnum | PurchasingLookupScalarFieldEnum[]
  }

  /**
   * PurchasingLookup findFirstOrThrow
   */
  export type PurchasingLookupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchasingLookup
     */
    select?: PurchasingLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchasingLookup
     */
    omit?: PurchasingLookupOmit<ExtArgs> | null
    /**
     * Filter, which PurchasingLookup to fetch.
     */
    where?: PurchasingLookupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchasingLookups to fetch.
     */
    orderBy?: PurchasingLookupOrderByWithRelationInput | PurchasingLookupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchasingLookups.
     */
    cursor?: PurchasingLookupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchasingLookups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchasingLookups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchasingLookups.
     */
    distinct?: PurchasingLookupScalarFieldEnum | PurchasingLookupScalarFieldEnum[]
  }

  /**
   * PurchasingLookup findMany
   */
  export type PurchasingLookupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchasingLookup
     */
    select?: PurchasingLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchasingLookup
     */
    omit?: PurchasingLookupOmit<ExtArgs> | null
    /**
     * Filter, which PurchasingLookups to fetch.
     */
    where?: PurchasingLookupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchasingLookups to fetch.
     */
    orderBy?: PurchasingLookupOrderByWithRelationInput | PurchasingLookupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PurchasingLookups.
     */
    cursor?: PurchasingLookupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchasingLookups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchasingLookups.
     */
    skip?: number
    distinct?: PurchasingLookupScalarFieldEnum | PurchasingLookupScalarFieldEnum[]
  }

  /**
   * PurchasingLookup create
   */
  export type PurchasingLookupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchasingLookup
     */
    select?: PurchasingLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchasingLookup
     */
    omit?: PurchasingLookupOmit<ExtArgs> | null
    /**
     * The data needed to create a PurchasingLookup.
     */
    data: XOR<PurchasingLookupCreateInput, PurchasingLookupUncheckedCreateInput>
  }

  /**
   * PurchasingLookup createMany
   */
  export type PurchasingLookupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PurchasingLookups.
     */
    data: PurchasingLookupCreateManyInput | PurchasingLookupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PurchasingLookup createManyAndReturn
   */
  export type PurchasingLookupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchasingLookup
     */
    select?: PurchasingLookupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PurchasingLookup
     */
    omit?: PurchasingLookupOmit<ExtArgs> | null
    /**
     * The data used to create many PurchasingLookups.
     */
    data: PurchasingLookupCreateManyInput | PurchasingLookupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PurchasingLookup update
   */
  export type PurchasingLookupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchasingLookup
     */
    select?: PurchasingLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchasingLookup
     */
    omit?: PurchasingLookupOmit<ExtArgs> | null
    /**
     * The data needed to update a PurchasingLookup.
     */
    data: XOR<PurchasingLookupUpdateInput, PurchasingLookupUncheckedUpdateInput>
    /**
     * Choose, which PurchasingLookup to update.
     */
    where: PurchasingLookupWhereUniqueInput
  }

  /**
   * PurchasingLookup updateMany
   */
  export type PurchasingLookupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PurchasingLookups.
     */
    data: XOR<PurchasingLookupUpdateManyMutationInput, PurchasingLookupUncheckedUpdateManyInput>
    /**
     * Filter which PurchasingLookups to update
     */
    where?: PurchasingLookupWhereInput
    /**
     * Limit how many PurchasingLookups to update.
     */
    limit?: number
  }

  /**
   * PurchasingLookup updateManyAndReturn
   */
  export type PurchasingLookupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchasingLookup
     */
    select?: PurchasingLookupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PurchasingLookup
     */
    omit?: PurchasingLookupOmit<ExtArgs> | null
    /**
     * The data used to update PurchasingLookups.
     */
    data: XOR<PurchasingLookupUpdateManyMutationInput, PurchasingLookupUncheckedUpdateManyInput>
    /**
     * Filter which PurchasingLookups to update
     */
    where?: PurchasingLookupWhereInput
    /**
     * Limit how many PurchasingLookups to update.
     */
    limit?: number
  }

  /**
   * PurchasingLookup upsert
   */
  export type PurchasingLookupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchasingLookup
     */
    select?: PurchasingLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchasingLookup
     */
    omit?: PurchasingLookupOmit<ExtArgs> | null
    /**
     * The filter to search for the PurchasingLookup to update in case it exists.
     */
    where: PurchasingLookupWhereUniqueInput
    /**
     * In case the PurchasingLookup found by the `where` argument doesn't exist, create a new PurchasingLookup with this data.
     */
    create: XOR<PurchasingLookupCreateInput, PurchasingLookupUncheckedCreateInput>
    /**
     * In case the PurchasingLookup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchasingLookupUpdateInput, PurchasingLookupUncheckedUpdateInput>
  }

  /**
   * PurchasingLookup delete
   */
  export type PurchasingLookupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchasingLookup
     */
    select?: PurchasingLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchasingLookup
     */
    omit?: PurchasingLookupOmit<ExtArgs> | null
    /**
     * Filter which PurchasingLookup to delete.
     */
    where: PurchasingLookupWhereUniqueInput
  }

  /**
   * PurchasingLookup deleteMany
   */
  export type PurchasingLookupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchasingLookups to delete
     */
    where?: PurchasingLookupWhereInput
    /**
     * Limit how many PurchasingLookups to delete.
     */
    limit?: number
  }

  /**
   * PurchasingLookup without action
   */
  export type PurchasingLookupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchasingLookup
     */
    select?: PurchasingLookupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchasingLookup
     */
    omit?: PurchasingLookupOmit<ExtArgs> | null
  }


  /**
   * Model SupplierTypeAssignment
   */

  export type AggregateSupplierTypeAssignment = {
    _count: SupplierTypeAssignmentCountAggregateOutputType | null
    _avg: SupplierTypeAssignmentAvgAggregateOutputType | null
    _sum: SupplierTypeAssignmentSumAggregateOutputType | null
    _min: SupplierTypeAssignmentMinAggregateOutputType | null
    _max: SupplierTypeAssignmentMaxAggregateOutputType | null
  }

  export type SupplierTypeAssignmentAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type SupplierTypeAssignmentSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type SupplierTypeAssignmentMinAggregateOutputType = {
    id: number | null
    userId: number | null
    category: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierTypeAssignmentMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    category: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierTypeAssignmentCountAggregateOutputType = {
    id: number
    userId: number
    category: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SupplierTypeAssignmentAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type SupplierTypeAssignmentSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type SupplierTypeAssignmentMinAggregateInputType = {
    id?: true
    userId?: true
    category?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierTypeAssignmentMaxAggregateInputType = {
    id?: true
    userId?: true
    category?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierTypeAssignmentCountAggregateInputType = {
    id?: true
    userId?: true
    category?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SupplierTypeAssignmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupplierTypeAssignment to aggregate.
     */
    where?: SupplierTypeAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierTypeAssignments to fetch.
     */
    orderBy?: SupplierTypeAssignmentOrderByWithRelationInput | SupplierTypeAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupplierTypeAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierTypeAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierTypeAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SupplierTypeAssignments
    **/
    _count?: true | SupplierTypeAssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SupplierTypeAssignmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SupplierTypeAssignmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupplierTypeAssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupplierTypeAssignmentMaxAggregateInputType
  }

  export type GetSupplierTypeAssignmentAggregateType<T extends SupplierTypeAssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateSupplierTypeAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupplierTypeAssignment[P]>
      : GetScalarType<T[P], AggregateSupplierTypeAssignment[P]>
  }




  export type SupplierTypeAssignmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupplierTypeAssignmentWhereInput
    orderBy?: SupplierTypeAssignmentOrderByWithAggregationInput | SupplierTypeAssignmentOrderByWithAggregationInput[]
    by: SupplierTypeAssignmentScalarFieldEnum[] | SupplierTypeAssignmentScalarFieldEnum
    having?: SupplierTypeAssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupplierTypeAssignmentCountAggregateInputType | true
    _avg?: SupplierTypeAssignmentAvgAggregateInputType
    _sum?: SupplierTypeAssignmentSumAggregateInputType
    _min?: SupplierTypeAssignmentMinAggregateInputType
    _max?: SupplierTypeAssignmentMaxAggregateInputType
  }

  export type SupplierTypeAssignmentGroupByOutputType = {
    id: number
    userId: number
    category: string
    createdAt: Date
    updatedAt: Date
    _count: SupplierTypeAssignmentCountAggregateOutputType | null
    _avg: SupplierTypeAssignmentAvgAggregateOutputType | null
    _sum: SupplierTypeAssignmentSumAggregateOutputType | null
    _min: SupplierTypeAssignmentMinAggregateOutputType | null
    _max: SupplierTypeAssignmentMaxAggregateOutputType | null
  }

  type GetSupplierTypeAssignmentGroupByPayload<T extends SupplierTypeAssignmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupplierTypeAssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupplierTypeAssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupplierTypeAssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], SupplierTypeAssignmentGroupByOutputType[P]>
        }
      >
    >


  export type SupplierTypeAssignmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supplierTypeAssignment"]>

  export type SupplierTypeAssignmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supplierTypeAssignment"]>

  export type SupplierTypeAssignmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supplierTypeAssignment"]>

  export type SupplierTypeAssignmentSelectScalar = {
    id?: boolean
    userId?: boolean
    category?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SupplierTypeAssignmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "category" | "createdAt" | "updatedAt", ExtArgs["result"]["supplierTypeAssignment"]>
  export type SupplierTypeAssignmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SupplierTypeAssignmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SupplierTypeAssignmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SupplierTypeAssignmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SupplierTypeAssignment"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      category: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["supplierTypeAssignment"]>
    composites: {}
  }

  type SupplierTypeAssignmentGetPayload<S extends boolean | null | undefined | SupplierTypeAssignmentDefaultArgs> = $Result.GetResult<Prisma.$SupplierTypeAssignmentPayload, S>

  type SupplierTypeAssignmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SupplierTypeAssignmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SupplierTypeAssignmentCountAggregateInputType | true
    }

  export interface SupplierTypeAssignmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SupplierTypeAssignment'], meta: { name: 'SupplierTypeAssignment' } }
    /**
     * Find zero or one SupplierTypeAssignment that matches the filter.
     * @param {SupplierTypeAssignmentFindUniqueArgs} args - Arguments to find a SupplierTypeAssignment
     * @example
     * // Get one SupplierTypeAssignment
     * const supplierTypeAssignment = await prisma.supplierTypeAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupplierTypeAssignmentFindUniqueArgs>(args: SelectSubset<T, SupplierTypeAssignmentFindUniqueArgs<ExtArgs>>): Prisma__SupplierTypeAssignmentClient<$Result.GetResult<Prisma.$SupplierTypeAssignmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SupplierTypeAssignment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SupplierTypeAssignmentFindUniqueOrThrowArgs} args - Arguments to find a SupplierTypeAssignment
     * @example
     * // Get one SupplierTypeAssignment
     * const supplierTypeAssignment = await prisma.supplierTypeAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupplierTypeAssignmentFindUniqueOrThrowArgs>(args: SelectSubset<T, SupplierTypeAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupplierTypeAssignmentClient<$Result.GetResult<Prisma.$SupplierTypeAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SupplierTypeAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierTypeAssignmentFindFirstArgs} args - Arguments to find a SupplierTypeAssignment
     * @example
     * // Get one SupplierTypeAssignment
     * const supplierTypeAssignment = await prisma.supplierTypeAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupplierTypeAssignmentFindFirstArgs>(args?: SelectSubset<T, SupplierTypeAssignmentFindFirstArgs<ExtArgs>>): Prisma__SupplierTypeAssignmentClient<$Result.GetResult<Prisma.$SupplierTypeAssignmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SupplierTypeAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierTypeAssignmentFindFirstOrThrowArgs} args - Arguments to find a SupplierTypeAssignment
     * @example
     * // Get one SupplierTypeAssignment
     * const supplierTypeAssignment = await prisma.supplierTypeAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupplierTypeAssignmentFindFirstOrThrowArgs>(args?: SelectSubset<T, SupplierTypeAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupplierTypeAssignmentClient<$Result.GetResult<Prisma.$SupplierTypeAssignmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SupplierTypeAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierTypeAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SupplierTypeAssignments
     * const supplierTypeAssignments = await prisma.supplierTypeAssignment.findMany()
     * 
     * // Get first 10 SupplierTypeAssignments
     * const supplierTypeAssignments = await prisma.supplierTypeAssignment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const supplierTypeAssignmentWithIdOnly = await prisma.supplierTypeAssignment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SupplierTypeAssignmentFindManyArgs>(args?: SelectSubset<T, SupplierTypeAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierTypeAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SupplierTypeAssignment.
     * @param {SupplierTypeAssignmentCreateArgs} args - Arguments to create a SupplierTypeAssignment.
     * @example
     * // Create one SupplierTypeAssignment
     * const SupplierTypeAssignment = await prisma.supplierTypeAssignment.create({
     *   data: {
     *     // ... data to create a SupplierTypeAssignment
     *   }
     * })
     * 
     */
    create<T extends SupplierTypeAssignmentCreateArgs>(args: SelectSubset<T, SupplierTypeAssignmentCreateArgs<ExtArgs>>): Prisma__SupplierTypeAssignmentClient<$Result.GetResult<Prisma.$SupplierTypeAssignmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SupplierTypeAssignments.
     * @param {SupplierTypeAssignmentCreateManyArgs} args - Arguments to create many SupplierTypeAssignments.
     * @example
     * // Create many SupplierTypeAssignments
     * const supplierTypeAssignment = await prisma.supplierTypeAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupplierTypeAssignmentCreateManyArgs>(args?: SelectSubset<T, SupplierTypeAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SupplierTypeAssignments and returns the data saved in the database.
     * @param {SupplierTypeAssignmentCreateManyAndReturnArgs} args - Arguments to create many SupplierTypeAssignments.
     * @example
     * // Create many SupplierTypeAssignments
     * const supplierTypeAssignment = await prisma.supplierTypeAssignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SupplierTypeAssignments and only return the `id`
     * const supplierTypeAssignmentWithIdOnly = await prisma.supplierTypeAssignment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SupplierTypeAssignmentCreateManyAndReturnArgs>(args?: SelectSubset<T, SupplierTypeAssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierTypeAssignmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SupplierTypeAssignment.
     * @param {SupplierTypeAssignmentDeleteArgs} args - Arguments to delete one SupplierTypeAssignment.
     * @example
     * // Delete one SupplierTypeAssignment
     * const SupplierTypeAssignment = await prisma.supplierTypeAssignment.delete({
     *   where: {
     *     // ... filter to delete one SupplierTypeAssignment
     *   }
     * })
     * 
     */
    delete<T extends SupplierTypeAssignmentDeleteArgs>(args: SelectSubset<T, SupplierTypeAssignmentDeleteArgs<ExtArgs>>): Prisma__SupplierTypeAssignmentClient<$Result.GetResult<Prisma.$SupplierTypeAssignmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SupplierTypeAssignment.
     * @param {SupplierTypeAssignmentUpdateArgs} args - Arguments to update one SupplierTypeAssignment.
     * @example
     * // Update one SupplierTypeAssignment
     * const supplierTypeAssignment = await prisma.supplierTypeAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupplierTypeAssignmentUpdateArgs>(args: SelectSubset<T, SupplierTypeAssignmentUpdateArgs<ExtArgs>>): Prisma__SupplierTypeAssignmentClient<$Result.GetResult<Prisma.$SupplierTypeAssignmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SupplierTypeAssignments.
     * @param {SupplierTypeAssignmentDeleteManyArgs} args - Arguments to filter SupplierTypeAssignments to delete.
     * @example
     * // Delete a few SupplierTypeAssignments
     * const { count } = await prisma.supplierTypeAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupplierTypeAssignmentDeleteManyArgs>(args?: SelectSubset<T, SupplierTypeAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SupplierTypeAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierTypeAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SupplierTypeAssignments
     * const supplierTypeAssignment = await prisma.supplierTypeAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupplierTypeAssignmentUpdateManyArgs>(args: SelectSubset<T, SupplierTypeAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SupplierTypeAssignments and returns the data updated in the database.
     * @param {SupplierTypeAssignmentUpdateManyAndReturnArgs} args - Arguments to update many SupplierTypeAssignments.
     * @example
     * // Update many SupplierTypeAssignments
     * const supplierTypeAssignment = await prisma.supplierTypeAssignment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SupplierTypeAssignments and only return the `id`
     * const supplierTypeAssignmentWithIdOnly = await prisma.supplierTypeAssignment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SupplierTypeAssignmentUpdateManyAndReturnArgs>(args: SelectSubset<T, SupplierTypeAssignmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierTypeAssignmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SupplierTypeAssignment.
     * @param {SupplierTypeAssignmentUpsertArgs} args - Arguments to update or create a SupplierTypeAssignment.
     * @example
     * // Update or create a SupplierTypeAssignment
     * const supplierTypeAssignment = await prisma.supplierTypeAssignment.upsert({
     *   create: {
     *     // ... data to create a SupplierTypeAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SupplierTypeAssignment we want to update
     *   }
     * })
     */
    upsert<T extends SupplierTypeAssignmentUpsertArgs>(args: SelectSubset<T, SupplierTypeAssignmentUpsertArgs<ExtArgs>>): Prisma__SupplierTypeAssignmentClient<$Result.GetResult<Prisma.$SupplierTypeAssignmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SupplierTypeAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierTypeAssignmentCountArgs} args - Arguments to filter SupplierTypeAssignments to count.
     * @example
     * // Count the number of SupplierTypeAssignments
     * const count = await prisma.supplierTypeAssignment.count({
     *   where: {
     *     // ... the filter for the SupplierTypeAssignments we want to count
     *   }
     * })
    **/
    count<T extends SupplierTypeAssignmentCountArgs>(
      args?: Subset<T, SupplierTypeAssignmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupplierTypeAssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SupplierTypeAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierTypeAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SupplierTypeAssignmentAggregateArgs>(args: Subset<T, SupplierTypeAssignmentAggregateArgs>): Prisma.PrismaPromise<GetSupplierTypeAssignmentAggregateType<T>>

    /**
     * Group by SupplierTypeAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierTypeAssignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SupplierTypeAssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupplierTypeAssignmentGroupByArgs['orderBy'] }
        : { orderBy?: SupplierTypeAssignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SupplierTypeAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierTypeAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SupplierTypeAssignment model
   */
  readonly fields: SupplierTypeAssignmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SupplierTypeAssignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupplierTypeAssignmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SupplierTypeAssignment model
   */
  interface SupplierTypeAssignmentFieldRefs {
    readonly id: FieldRef<"SupplierTypeAssignment", 'Int'>
    readonly userId: FieldRef<"SupplierTypeAssignment", 'Int'>
    readonly category: FieldRef<"SupplierTypeAssignment", 'String'>
    readonly createdAt: FieldRef<"SupplierTypeAssignment", 'DateTime'>
    readonly updatedAt: FieldRef<"SupplierTypeAssignment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SupplierTypeAssignment findUnique
   */
  export type SupplierTypeAssignmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierTypeAssignment
     */
    select?: SupplierTypeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierTypeAssignment
     */
    omit?: SupplierTypeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierTypeAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which SupplierTypeAssignment to fetch.
     */
    where: SupplierTypeAssignmentWhereUniqueInput
  }

  /**
   * SupplierTypeAssignment findUniqueOrThrow
   */
  export type SupplierTypeAssignmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierTypeAssignment
     */
    select?: SupplierTypeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierTypeAssignment
     */
    omit?: SupplierTypeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierTypeAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which SupplierTypeAssignment to fetch.
     */
    where: SupplierTypeAssignmentWhereUniqueInput
  }

  /**
   * SupplierTypeAssignment findFirst
   */
  export type SupplierTypeAssignmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierTypeAssignment
     */
    select?: SupplierTypeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierTypeAssignment
     */
    omit?: SupplierTypeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierTypeAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which SupplierTypeAssignment to fetch.
     */
    where?: SupplierTypeAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierTypeAssignments to fetch.
     */
    orderBy?: SupplierTypeAssignmentOrderByWithRelationInput | SupplierTypeAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupplierTypeAssignments.
     */
    cursor?: SupplierTypeAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierTypeAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierTypeAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupplierTypeAssignments.
     */
    distinct?: SupplierTypeAssignmentScalarFieldEnum | SupplierTypeAssignmentScalarFieldEnum[]
  }

  /**
   * SupplierTypeAssignment findFirstOrThrow
   */
  export type SupplierTypeAssignmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierTypeAssignment
     */
    select?: SupplierTypeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierTypeAssignment
     */
    omit?: SupplierTypeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierTypeAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which SupplierTypeAssignment to fetch.
     */
    where?: SupplierTypeAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierTypeAssignments to fetch.
     */
    orderBy?: SupplierTypeAssignmentOrderByWithRelationInput | SupplierTypeAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupplierTypeAssignments.
     */
    cursor?: SupplierTypeAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierTypeAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierTypeAssignments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupplierTypeAssignments.
     */
    distinct?: SupplierTypeAssignmentScalarFieldEnum | SupplierTypeAssignmentScalarFieldEnum[]
  }

  /**
   * SupplierTypeAssignment findMany
   */
  export type SupplierTypeAssignmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierTypeAssignment
     */
    select?: SupplierTypeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierTypeAssignment
     */
    omit?: SupplierTypeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierTypeAssignmentInclude<ExtArgs> | null
    /**
     * Filter, which SupplierTypeAssignments to fetch.
     */
    where?: SupplierTypeAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierTypeAssignments to fetch.
     */
    orderBy?: SupplierTypeAssignmentOrderByWithRelationInput | SupplierTypeAssignmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SupplierTypeAssignments.
     */
    cursor?: SupplierTypeAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierTypeAssignments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierTypeAssignments.
     */
    skip?: number
    distinct?: SupplierTypeAssignmentScalarFieldEnum | SupplierTypeAssignmentScalarFieldEnum[]
  }

  /**
   * SupplierTypeAssignment create
   */
  export type SupplierTypeAssignmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierTypeAssignment
     */
    select?: SupplierTypeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierTypeAssignment
     */
    omit?: SupplierTypeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierTypeAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to create a SupplierTypeAssignment.
     */
    data: XOR<SupplierTypeAssignmentCreateInput, SupplierTypeAssignmentUncheckedCreateInput>
  }

  /**
   * SupplierTypeAssignment createMany
   */
  export type SupplierTypeAssignmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SupplierTypeAssignments.
     */
    data: SupplierTypeAssignmentCreateManyInput | SupplierTypeAssignmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SupplierTypeAssignment createManyAndReturn
   */
  export type SupplierTypeAssignmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierTypeAssignment
     */
    select?: SupplierTypeAssignmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierTypeAssignment
     */
    omit?: SupplierTypeAssignmentOmit<ExtArgs> | null
    /**
     * The data used to create many SupplierTypeAssignments.
     */
    data: SupplierTypeAssignmentCreateManyInput | SupplierTypeAssignmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierTypeAssignmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SupplierTypeAssignment update
   */
  export type SupplierTypeAssignmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierTypeAssignment
     */
    select?: SupplierTypeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierTypeAssignment
     */
    omit?: SupplierTypeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierTypeAssignmentInclude<ExtArgs> | null
    /**
     * The data needed to update a SupplierTypeAssignment.
     */
    data: XOR<SupplierTypeAssignmentUpdateInput, SupplierTypeAssignmentUncheckedUpdateInput>
    /**
     * Choose, which SupplierTypeAssignment to update.
     */
    where: SupplierTypeAssignmentWhereUniqueInput
  }

  /**
   * SupplierTypeAssignment updateMany
   */
  export type SupplierTypeAssignmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SupplierTypeAssignments.
     */
    data: XOR<SupplierTypeAssignmentUpdateManyMutationInput, SupplierTypeAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which SupplierTypeAssignments to update
     */
    where?: SupplierTypeAssignmentWhereInput
    /**
     * Limit how many SupplierTypeAssignments to update.
     */
    limit?: number
  }

  /**
   * SupplierTypeAssignment updateManyAndReturn
   */
  export type SupplierTypeAssignmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierTypeAssignment
     */
    select?: SupplierTypeAssignmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierTypeAssignment
     */
    omit?: SupplierTypeAssignmentOmit<ExtArgs> | null
    /**
     * The data used to update SupplierTypeAssignments.
     */
    data: XOR<SupplierTypeAssignmentUpdateManyMutationInput, SupplierTypeAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which SupplierTypeAssignments to update
     */
    where?: SupplierTypeAssignmentWhereInput
    /**
     * Limit how many SupplierTypeAssignments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierTypeAssignmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SupplierTypeAssignment upsert
   */
  export type SupplierTypeAssignmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierTypeAssignment
     */
    select?: SupplierTypeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierTypeAssignment
     */
    omit?: SupplierTypeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierTypeAssignmentInclude<ExtArgs> | null
    /**
     * The filter to search for the SupplierTypeAssignment to update in case it exists.
     */
    where: SupplierTypeAssignmentWhereUniqueInput
    /**
     * In case the SupplierTypeAssignment found by the `where` argument doesn't exist, create a new SupplierTypeAssignment with this data.
     */
    create: XOR<SupplierTypeAssignmentCreateInput, SupplierTypeAssignmentUncheckedCreateInput>
    /**
     * In case the SupplierTypeAssignment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupplierTypeAssignmentUpdateInput, SupplierTypeAssignmentUncheckedUpdateInput>
  }

  /**
   * SupplierTypeAssignment delete
   */
  export type SupplierTypeAssignmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierTypeAssignment
     */
    select?: SupplierTypeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierTypeAssignment
     */
    omit?: SupplierTypeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierTypeAssignmentInclude<ExtArgs> | null
    /**
     * Filter which SupplierTypeAssignment to delete.
     */
    where: SupplierTypeAssignmentWhereUniqueInput
  }

  /**
   * SupplierTypeAssignment deleteMany
   */
  export type SupplierTypeAssignmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupplierTypeAssignments to delete
     */
    where?: SupplierTypeAssignmentWhereInput
    /**
     * Limit how many SupplierTypeAssignments to delete.
     */
    limit?: number
  }

  /**
   * SupplierTypeAssignment without action
   */
  export type SupplierTypeAssignmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierTypeAssignment
     */
    select?: SupplierTypeAssignmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierTypeAssignment
     */
    omit?: SupplierTypeAssignmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierTypeAssignmentInclude<ExtArgs> | null
  }


  /**
   * Model PurchaseRequestRecord
   */

  export type AggregatePurchaseRequestRecord = {
    _count: PurchaseRequestRecordCountAggregateOutputType | null
    _min: PurchaseRequestRecordMinAggregateOutputType | null
    _max: PurchaseRequestRecordMaxAggregateOutputType | null
  }

  export type PurchaseRequestRecordMinAggregateOutputType = {
    localId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PurchaseRequestRecordMaxAggregateOutputType = {
    localId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PurchaseRequestRecordCountAggregateOutputType = {
    localId: number
    payload: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PurchaseRequestRecordMinAggregateInputType = {
    localId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PurchaseRequestRecordMaxAggregateInputType = {
    localId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PurchaseRequestRecordCountAggregateInputType = {
    localId?: true
    payload?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PurchaseRequestRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseRequestRecord to aggregate.
     */
    where?: PurchaseRequestRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseRequestRecords to fetch.
     */
    orderBy?: PurchaseRequestRecordOrderByWithRelationInput | PurchaseRequestRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchaseRequestRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseRequestRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseRequestRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PurchaseRequestRecords
    **/
    _count?: true | PurchaseRequestRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchaseRequestRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchaseRequestRecordMaxAggregateInputType
  }

  export type GetPurchaseRequestRecordAggregateType<T extends PurchaseRequestRecordAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchaseRequestRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchaseRequestRecord[P]>
      : GetScalarType<T[P], AggregatePurchaseRequestRecord[P]>
  }




  export type PurchaseRequestRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseRequestRecordWhereInput
    orderBy?: PurchaseRequestRecordOrderByWithAggregationInput | PurchaseRequestRecordOrderByWithAggregationInput[]
    by: PurchaseRequestRecordScalarFieldEnum[] | PurchaseRequestRecordScalarFieldEnum
    having?: PurchaseRequestRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchaseRequestRecordCountAggregateInputType | true
    _min?: PurchaseRequestRecordMinAggregateInputType
    _max?: PurchaseRequestRecordMaxAggregateInputType
  }

  export type PurchaseRequestRecordGroupByOutputType = {
    localId: string
    payload: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: PurchaseRequestRecordCountAggregateOutputType | null
    _min: PurchaseRequestRecordMinAggregateOutputType | null
    _max: PurchaseRequestRecordMaxAggregateOutputType | null
  }

  type GetPurchaseRequestRecordGroupByPayload<T extends PurchaseRequestRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchaseRequestRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchaseRequestRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchaseRequestRecordGroupByOutputType[P]>
            : GetScalarType<T[P], PurchaseRequestRecordGroupByOutputType[P]>
        }
      >
    >


  export type PurchaseRequestRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["purchaseRequestRecord"]>

  export type PurchaseRequestRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["purchaseRequestRecord"]>

  export type PurchaseRequestRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["purchaseRequestRecord"]>

  export type PurchaseRequestRecordSelectScalar = {
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PurchaseRequestRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"localId" | "payload" | "createdAt" | "updatedAt", ExtArgs["result"]["purchaseRequestRecord"]>

  export type $PurchaseRequestRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PurchaseRequestRecord"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      localId: string
      payload: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["purchaseRequestRecord"]>
    composites: {}
  }

  type PurchaseRequestRecordGetPayload<S extends boolean | null | undefined | PurchaseRequestRecordDefaultArgs> = $Result.GetResult<Prisma.$PurchaseRequestRecordPayload, S>

  type PurchaseRequestRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PurchaseRequestRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PurchaseRequestRecordCountAggregateInputType | true
    }

  export interface PurchaseRequestRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PurchaseRequestRecord'], meta: { name: 'PurchaseRequestRecord' } }
    /**
     * Find zero or one PurchaseRequestRecord that matches the filter.
     * @param {PurchaseRequestRecordFindUniqueArgs} args - Arguments to find a PurchaseRequestRecord
     * @example
     * // Get one PurchaseRequestRecord
     * const purchaseRequestRecord = await prisma.purchaseRequestRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchaseRequestRecordFindUniqueArgs>(args: SelectSubset<T, PurchaseRequestRecordFindUniqueArgs<ExtArgs>>): Prisma__PurchaseRequestRecordClient<$Result.GetResult<Prisma.$PurchaseRequestRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PurchaseRequestRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PurchaseRequestRecordFindUniqueOrThrowArgs} args - Arguments to find a PurchaseRequestRecord
     * @example
     * // Get one PurchaseRequestRecord
     * const purchaseRequestRecord = await prisma.purchaseRequestRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchaseRequestRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchaseRequestRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchaseRequestRecordClient<$Result.GetResult<Prisma.$PurchaseRequestRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseRequestRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseRequestRecordFindFirstArgs} args - Arguments to find a PurchaseRequestRecord
     * @example
     * // Get one PurchaseRequestRecord
     * const purchaseRequestRecord = await prisma.purchaseRequestRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchaseRequestRecordFindFirstArgs>(args?: SelectSubset<T, PurchaseRequestRecordFindFirstArgs<ExtArgs>>): Prisma__PurchaseRequestRecordClient<$Result.GetResult<Prisma.$PurchaseRequestRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseRequestRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseRequestRecordFindFirstOrThrowArgs} args - Arguments to find a PurchaseRequestRecord
     * @example
     * // Get one PurchaseRequestRecord
     * const purchaseRequestRecord = await prisma.purchaseRequestRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchaseRequestRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchaseRequestRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchaseRequestRecordClient<$Result.GetResult<Prisma.$PurchaseRequestRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PurchaseRequestRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseRequestRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PurchaseRequestRecords
     * const purchaseRequestRecords = await prisma.purchaseRequestRecord.findMany()
     * 
     * // Get first 10 PurchaseRequestRecords
     * const purchaseRequestRecords = await prisma.purchaseRequestRecord.findMany({ take: 10 })
     * 
     * // Only select the `localId`
     * const purchaseRequestRecordWithLocalIdOnly = await prisma.purchaseRequestRecord.findMany({ select: { localId: true } })
     * 
     */
    findMany<T extends PurchaseRequestRecordFindManyArgs>(args?: SelectSubset<T, PurchaseRequestRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseRequestRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PurchaseRequestRecord.
     * @param {PurchaseRequestRecordCreateArgs} args - Arguments to create a PurchaseRequestRecord.
     * @example
     * // Create one PurchaseRequestRecord
     * const PurchaseRequestRecord = await prisma.purchaseRequestRecord.create({
     *   data: {
     *     // ... data to create a PurchaseRequestRecord
     *   }
     * })
     * 
     */
    create<T extends PurchaseRequestRecordCreateArgs>(args: SelectSubset<T, PurchaseRequestRecordCreateArgs<ExtArgs>>): Prisma__PurchaseRequestRecordClient<$Result.GetResult<Prisma.$PurchaseRequestRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PurchaseRequestRecords.
     * @param {PurchaseRequestRecordCreateManyArgs} args - Arguments to create many PurchaseRequestRecords.
     * @example
     * // Create many PurchaseRequestRecords
     * const purchaseRequestRecord = await prisma.purchaseRequestRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchaseRequestRecordCreateManyArgs>(args?: SelectSubset<T, PurchaseRequestRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PurchaseRequestRecords and returns the data saved in the database.
     * @param {PurchaseRequestRecordCreateManyAndReturnArgs} args - Arguments to create many PurchaseRequestRecords.
     * @example
     * // Create many PurchaseRequestRecords
     * const purchaseRequestRecord = await prisma.purchaseRequestRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PurchaseRequestRecords and only return the `localId`
     * const purchaseRequestRecordWithLocalIdOnly = await prisma.purchaseRequestRecord.createManyAndReturn({
     *   select: { localId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PurchaseRequestRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, PurchaseRequestRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseRequestRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PurchaseRequestRecord.
     * @param {PurchaseRequestRecordDeleteArgs} args - Arguments to delete one PurchaseRequestRecord.
     * @example
     * // Delete one PurchaseRequestRecord
     * const PurchaseRequestRecord = await prisma.purchaseRequestRecord.delete({
     *   where: {
     *     // ... filter to delete one PurchaseRequestRecord
     *   }
     * })
     * 
     */
    delete<T extends PurchaseRequestRecordDeleteArgs>(args: SelectSubset<T, PurchaseRequestRecordDeleteArgs<ExtArgs>>): Prisma__PurchaseRequestRecordClient<$Result.GetResult<Prisma.$PurchaseRequestRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PurchaseRequestRecord.
     * @param {PurchaseRequestRecordUpdateArgs} args - Arguments to update one PurchaseRequestRecord.
     * @example
     * // Update one PurchaseRequestRecord
     * const purchaseRequestRecord = await prisma.purchaseRequestRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchaseRequestRecordUpdateArgs>(args: SelectSubset<T, PurchaseRequestRecordUpdateArgs<ExtArgs>>): Prisma__PurchaseRequestRecordClient<$Result.GetResult<Prisma.$PurchaseRequestRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PurchaseRequestRecords.
     * @param {PurchaseRequestRecordDeleteManyArgs} args - Arguments to filter PurchaseRequestRecords to delete.
     * @example
     * // Delete a few PurchaseRequestRecords
     * const { count } = await prisma.purchaseRequestRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchaseRequestRecordDeleteManyArgs>(args?: SelectSubset<T, PurchaseRequestRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseRequestRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseRequestRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PurchaseRequestRecords
     * const purchaseRequestRecord = await prisma.purchaseRequestRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchaseRequestRecordUpdateManyArgs>(args: SelectSubset<T, PurchaseRequestRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseRequestRecords and returns the data updated in the database.
     * @param {PurchaseRequestRecordUpdateManyAndReturnArgs} args - Arguments to update many PurchaseRequestRecords.
     * @example
     * // Update many PurchaseRequestRecords
     * const purchaseRequestRecord = await prisma.purchaseRequestRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PurchaseRequestRecords and only return the `localId`
     * const purchaseRequestRecordWithLocalIdOnly = await prisma.purchaseRequestRecord.updateManyAndReturn({
     *   select: { localId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PurchaseRequestRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, PurchaseRequestRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseRequestRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PurchaseRequestRecord.
     * @param {PurchaseRequestRecordUpsertArgs} args - Arguments to update or create a PurchaseRequestRecord.
     * @example
     * // Update or create a PurchaseRequestRecord
     * const purchaseRequestRecord = await prisma.purchaseRequestRecord.upsert({
     *   create: {
     *     // ... data to create a PurchaseRequestRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PurchaseRequestRecord we want to update
     *   }
     * })
     */
    upsert<T extends PurchaseRequestRecordUpsertArgs>(args: SelectSubset<T, PurchaseRequestRecordUpsertArgs<ExtArgs>>): Prisma__PurchaseRequestRecordClient<$Result.GetResult<Prisma.$PurchaseRequestRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PurchaseRequestRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseRequestRecordCountArgs} args - Arguments to filter PurchaseRequestRecords to count.
     * @example
     * // Count the number of PurchaseRequestRecords
     * const count = await prisma.purchaseRequestRecord.count({
     *   where: {
     *     // ... the filter for the PurchaseRequestRecords we want to count
     *   }
     * })
    **/
    count<T extends PurchaseRequestRecordCountArgs>(
      args?: Subset<T, PurchaseRequestRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchaseRequestRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PurchaseRequestRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseRequestRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchaseRequestRecordAggregateArgs>(args: Subset<T, PurchaseRequestRecordAggregateArgs>): Prisma.PrismaPromise<GetPurchaseRequestRecordAggregateType<T>>

    /**
     * Group by PurchaseRequestRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseRequestRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchaseRequestRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchaseRequestRecordGroupByArgs['orderBy'] }
        : { orderBy?: PurchaseRequestRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchaseRequestRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseRequestRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PurchaseRequestRecord model
   */
  readonly fields: PurchaseRequestRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PurchaseRequestRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchaseRequestRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PurchaseRequestRecord model
   */
  interface PurchaseRequestRecordFieldRefs {
    readonly localId: FieldRef<"PurchaseRequestRecord", 'String'>
    readonly payload: FieldRef<"PurchaseRequestRecord", 'Json'>
    readonly createdAt: FieldRef<"PurchaseRequestRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"PurchaseRequestRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PurchaseRequestRecord findUnique
   */
  export type PurchaseRequestRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseRequestRecord
     */
    select?: PurchaseRequestRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseRequestRecord
     */
    omit?: PurchaseRequestRecordOmit<ExtArgs> | null
    /**
     * Filter, which PurchaseRequestRecord to fetch.
     */
    where: PurchaseRequestRecordWhereUniqueInput
  }

  /**
   * PurchaseRequestRecord findUniqueOrThrow
   */
  export type PurchaseRequestRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseRequestRecord
     */
    select?: PurchaseRequestRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseRequestRecord
     */
    omit?: PurchaseRequestRecordOmit<ExtArgs> | null
    /**
     * Filter, which PurchaseRequestRecord to fetch.
     */
    where: PurchaseRequestRecordWhereUniqueInput
  }

  /**
   * PurchaseRequestRecord findFirst
   */
  export type PurchaseRequestRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseRequestRecord
     */
    select?: PurchaseRequestRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseRequestRecord
     */
    omit?: PurchaseRequestRecordOmit<ExtArgs> | null
    /**
     * Filter, which PurchaseRequestRecord to fetch.
     */
    where?: PurchaseRequestRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseRequestRecords to fetch.
     */
    orderBy?: PurchaseRequestRecordOrderByWithRelationInput | PurchaseRequestRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseRequestRecords.
     */
    cursor?: PurchaseRequestRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseRequestRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseRequestRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseRequestRecords.
     */
    distinct?: PurchaseRequestRecordScalarFieldEnum | PurchaseRequestRecordScalarFieldEnum[]
  }

  /**
   * PurchaseRequestRecord findFirstOrThrow
   */
  export type PurchaseRequestRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseRequestRecord
     */
    select?: PurchaseRequestRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseRequestRecord
     */
    omit?: PurchaseRequestRecordOmit<ExtArgs> | null
    /**
     * Filter, which PurchaseRequestRecord to fetch.
     */
    where?: PurchaseRequestRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseRequestRecords to fetch.
     */
    orderBy?: PurchaseRequestRecordOrderByWithRelationInput | PurchaseRequestRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseRequestRecords.
     */
    cursor?: PurchaseRequestRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseRequestRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseRequestRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseRequestRecords.
     */
    distinct?: PurchaseRequestRecordScalarFieldEnum | PurchaseRequestRecordScalarFieldEnum[]
  }

  /**
   * PurchaseRequestRecord findMany
   */
  export type PurchaseRequestRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseRequestRecord
     */
    select?: PurchaseRequestRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseRequestRecord
     */
    omit?: PurchaseRequestRecordOmit<ExtArgs> | null
    /**
     * Filter, which PurchaseRequestRecords to fetch.
     */
    where?: PurchaseRequestRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseRequestRecords to fetch.
     */
    orderBy?: PurchaseRequestRecordOrderByWithRelationInput | PurchaseRequestRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PurchaseRequestRecords.
     */
    cursor?: PurchaseRequestRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseRequestRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseRequestRecords.
     */
    skip?: number
    distinct?: PurchaseRequestRecordScalarFieldEnum | PurchaseRequestRecordScalarFieldEnum[]
  }

  /**
   * PurchaseRequestRecord create
   */
  export type PurchaseRequestRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseRequestRecord
     */
    select?: PurchaseRequestRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseRequestRecord
     */
    omit?: PurchaseRequestRecordOmit<ExtArgs> | null
    /**
     * The data needed to create a PurchaseRequestRecord.
     */
    data: XOR<PurchaseRequestRecordCreateInput, PurchaseRequestRecordUncheckedCreateInput>
  }

  /**
   * PurchaseRequestRecord createMany
   */
  export type PurchaseRequestRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PurchaseRequestRecords.
     */
    data: PurchaseRequestRecordCreateManyInput | PurchaseRequestRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PurchaseRequestRecord createManyAndReturn
   */
  export type PurchaseRequestRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseRequestRecord
     */
    select?: PurchaseRequestRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseRequestRecord
     */
    omit?: PurchaseRequestRecordOmit<ExtArgs> | null
    /**
     * The data used to create many PurchaseRequestRecords.
     */
    data: PurchaseRequestRecordCreateManyInput | PurchaseRequestRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PurchaseRequestRecord update
   */
  export type PurchaseRequestRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseRequestRecord
     */
    select?: PurchaseRequestRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseRequestRecord
     */
    omit?: PurchaseRequestRecordOmit<ExtArgs> | null
    /**
     * The data needed to update a PurchaseRequestRecord.
     */
    data: XOR<PurchaseRequestRecordUpdateInput, PurchaseRequestRecordUncheckedUpdateInput>
    /**
     * Choose, which PurchaseRequestRecord to update.
     */
    where: PurchaseRequestRecordWhereUniqueInput
  }

  /**
   * PurchaseRequestRecord updateMany
   */
  export type PurchaseRequestRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PurchaseRequestRecords.
     */
    data: XOR<PurchaseRequestRecordUpdateManyMutationInput, PurchaseRequestRecordUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseRequestRecords to update
     */
    where?: PurchaseRequestRecordWhereInput
    /**
     * Limit how many PurchaseRequestRecords to update.
     */
    limit?: number
  }

  /**
   * PurchaseRequestRecord updateManyAndReturn
   */
  export type PurchaseRequestRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseRequestRecord
     */
    select?: PurchaseRequestRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseRequestRecord
     */
    omit?: PurchaseRequestRecordOmit<ExtArgs> | null
    /**
     * The data used to update PurchaseRequestRecords.
     */
    data: XOR<PurchaseRequestRecordUpdateManyMutationInput, PurchaseRequestRecordUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseRequestRecords to update
     */
    where?: PurchaseRequestRecordWhereInput
    /**
     * Limit how many PurchaseRequestRecords to update.
     */
    limit?: number
  }

  /**
   * PurchaseRequestRecord upsert
   */
  export type PurchaseRequestRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseRequestRecord
     */
    select?: PurchaseRequestRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseRequestRecord
     */
    omit?: PurchaseRequestRecordOmit<ExtArgs> | null
    /**
     * The filter to search for the PurchaseRequestRecord to update in case it exists.
     */
    where: PurchaseRequestRecordWhereUniqueInput
    /**
     * In case the PurchaseRequestRecord found by the `where` argument doesn't exist, create a new PurchaseRequestRecord with this data.
     */
    create: XOR<PurchaseRequestRecordCreateInput, PurchaseRequestRecordUncheckedCreateInput>
    /**
     * In case the PurchaseRequestRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchaseRequestRecordUpdateInput, PurchaseRequestRecordUncheckedUpdateInput>
  }

  /**
   * PurchaseRequestRecord delete
   */
  export type PurchaseRequestRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseRequestRecord
     */
    select?: PurchaseRequestRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseRequestRecord
     */
    omit?: PurchaseRequestRecordOmit<ExtArgs> | null
    /**
     * Filter which PurchaseRequestRecord to delete.
     */
    where: PurchaseRequestRecordWhereUniqueInput
  }

  /**
   * PurchaseRequestRecord deleteMany
   */
  export type PurchaseRequestRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseRequestRecords to delete
     */
    where?: PurchaseRequestRecordWhereInput
    /**
     * Limit how many PurchaseRequestRecords to delete.
     */
    limit?: number
  }

  /**
   * PurchaseRequestRecord without action
   */
  export type PurchaseRequestRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseRequestRecord
     */
    select?: PurchaseRequestRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseRequestRecord
     */
    omit?: PurchaseRequestRecordOmit<ExtArgs> | null
  }


  /**
   * Model PurchaseOrderRecord
   */

  export type AggregatePurchaseOrderRecord = {
    _count: PurchaseOrderRecordCountAggregateOutputType | null
    _min: PurchaseOrderRecordMinAggregateOutputType | null
    _max: PurchaseOrderRecordMaxAggregateOutputType | null
  }

  export type PurchaseOrderRecordMinAggregateOutputType = {
    localId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PurchaseOrderRecordMaxAggregateOutputType = {
    localId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PurchaseOrderRecordCountAggregateOutputType = {
    localId: number
    payload: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PurchaseOrderRecordMinAggregateInputType = {
    localId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PurchaseOrderRecordMaxAggregateInputType = {
    localId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PurchaseOrderRecordCountAggregateInputType = {
    localId?: true
    payload?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PurchaseOrderRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseOrderRecord to aggregate.
     */
    where?: PurchaseOrderRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrderRecords to fetch.
     */
    orderBy?: PurchaseOrderRecordOrderByWithRelationInput | PurchaseOrderRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PurchaseOrderRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrderRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrderRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PurchaseOrderRecords
    **/
    _count?: true | PurchaseOrderRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PurchaseOrderRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PurchaseOrderRecordMaxAggregateInputType
  }

  export type GetPurchaseOrderRecordAggregateType<T extends PurchaseOrderRecordAggregateArgs> = {
        [P in keyof T & keyof AggregatePurchaseOrderRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePurchaseOrderRecord[P]>
      : GetScalarType<T[P], AggregatePurchaseOrderRecord[P]>
  }




  export type PurchaseOrderRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PurchaseOrderRecordWhereInput
    orderBy?: PurchaseOrderRecordOrderByWithAggregationInput | PurchaseOrderRecordOrderByWithAggregationInput[]
    by: PurchaseOrderRecordScalarFieldEnum[] | PurchaseOrderRecordScalarFieldEnum
    having?: PurchaseOrderRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PurchaseOrderRecordCountAggregateInputType | true
    _min?: PurchaseOrderRecordMinAggregateInputType
    _max?: PurchaseOrderRecordMaxAggregateInputType
  }

  export type PurchaseOrderRecordGroupByOutputType = {
    localId: string
    payload: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: PurchaseOrderRecordCountAggregateOutputType | null
    _min: PurchaseOrderRecordMinAggregateOutputType | null
    _max: PurchaseOrderRecordMaxAggregateOutputType | null
  }

  type GetPurchaseOrderRecordGroupByPayload<T extends PurchaseOrderRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PurchaseOrderRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PurchaseOrderRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PurchaseOrderRecordGroupByOutputType[P]>
            : GetScalarType<T[P], PurchaseOrderRecordGroupByOutputType[P]>
        }
      >
    >


  export type PurchaseOrderRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["purchaseOrderRecord"]>

  export type PurchaseOrderRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["purchaseOrderRecord"]>

  export type PurchaseOrderRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["purchaseOrderRecord"]>

  export type PurchaseOrderRecordSelectScalar = {
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PurchaseOrderRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"localId" | "payload" | "createdAt" | "updatedAt", ExtArgs["result"]["purchaseOrderRecord"]>

  export type $PurchaseOrderRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PurchaseOrderRecord"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      localId: string
      payload: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["purchaseOrderRecord"]>
    composites: {}
  }

  type PurchaseOrderRecordGetPayload<S extends boolean | null | undefined | PurchaseOrderRecordDefaultArgs> = $Result.GetResult<Prisma.$PurchaseOrderRecordPayload, S>

  type PurchaseOrderRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PurchaseOrderRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PurchaseOrderRecordCountAggregateInputType | true
    }

  export interface PurchaseOrderRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PurchaseOrderRecord'], meta: { name: 'PurchaseOrderRecord' } }
    /**
     * Find zero or one PurchaseOrderRecord that matches the filter.
     * @param {PurchaseOrderRecordFindUniqueArgs} args - Arguments to find a PurchaseOrderRecord
     * @example
     * // Get one PurchaseOrderRecord
     * const purchaseOrderRecord = await prisma.purchaseOrderRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PurchaseOrderRecordFindUniqueArgs>(args: SelectSubset<T, PurchaseOrderRecordFindUniqueArgs<ExtArgs>>): Prisma__PurchaseOrderRecordClient<$Result.GetResult<Prisma.$PurchaseOrderRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PurchaseOrderRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PurchaseOrderRecordFindUniqueOrThrowArgs} args - Arguments to find a PurchaseOrderRecord
     * @example
     * // Get one PurchaseOrderRecord
     * const purchaseOrderRecord = await prisma.purchaseOrderRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PurchaseOrderRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, PurchaseOrderRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PurchaseOrderRecordClient<$Result.GetResult<Prisma.$PurchaseOrderRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseOrderRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderRecordFindFirstArgs} args - Arguments to find a PurchaseOrderRecord
     * @example
     * // Get one PurchaseOrderRecord
     * const purchaseOrderRecord = await prisma.purchaseOrderRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PurchaseOrderRecordFindFirstArgs>(args?: SelectSubset<T, PurchaseOrderRecordFindFirstArgs<ExtArgs>>): Prisma__PurchaseOrderRecordClient<$Result.GetResult<Prisma.$PurchaseOrderRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PurchaseOrderRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderRecordFindFirstOrThrowArgs} args - Arguments to find a PurchaseOrderRecord
     * @example
     * // Get one PurchaseOrderRecord
     * const purchaseOrderRecord = await prisma.purchaseOrderRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PurchaseOrderRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, PurchaseOrderRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__PurchaseOrderRecordClient<$Result.GetResult<Prisma.$PurchaseOrderRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PurchaseOrderRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PurchaseOrderRecords
     * const purchaseOrderRecords = await prisma.purchaseOrderRecord.findMany()
     * 
     * // Get first 10 PurchaseOrderRecords
     * const purchaseOrderRecords = await prisma.purchaseOrderRecord.findMany({ take: 10 })
     * 
     * // Only select the `localId`
     * const purchaseOrderRecordWithLocalIdOnly = await prisma.purchaseOrderRecord.findMany({ select: { localId: true } })
     * 
     */
    findMany<T extends PurchaseOrderRecordFindManyArgs>(args?: SelectSubset<T, PurchaseOrderRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PurchaseOrderRecord.
     * @param {PurchaseOrderRecordCreateArgs} args - Arguments to create a PurchaseOrderRecord.
     * @example
     * // Create one PurchaseOrderRecord
     * const PurchaseOrderRecord = await prisma.purchaseOrderRecord.create({
     *   data: {
     *     // ... data to create a PurchaseOrderRecord
     *   }
     * })
     * 
     */
    create<T extends PurchaseOrderRecordCreateArgs>(args: SelectSubset<T, PurchaseOrderRecordCreateArgs<ExtArgs>>): Prisma__PurchaseOrderRecordClient<$Result.GetResult<Prisma.$PurchaseOrderRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PurchaseOrderRecords.
     * @param {PurchaseOrderRecordCreateManyArgs} args - Arguments to create many PurchaseOrderRecords.
     * @example
     * // Create many PurchaseOrderRecords
     * const purchaseOrderRecord = await prisma.purchaseOrderRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PurchaseOrderRecordCreateManyArgs>(args?: SelectSubset<T, PurchaseOrderRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PurchaseOrderRecords and returns the data saved in the database.
     * @param {PurchaseOrderRecordCreateManyAndReturnArgs} args - Arguments to create many PurchaseOrderRecords.
     * @example
     * // Create many PurchaseOrderRecords
     * const purchaseOrderRecord = await prisma.purchaseOrderRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PurchaseOrderRecords and only return the `localId`
     * const purchaseOrderRecordWithLocalIdOnly = await prisma.purchaseOrderRecord.createManyAndReturn({
     *   select: { localId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PurchaseOrderRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, PurchaseOrderRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PurchaseOrderRecord.
     * @param {PurchaseOrderRecordDeleteArgs} args - Arguments to delete one PurchaseOrderRecord.
     * @example
     * // Delete one PurchaseOrderRecord
     * const PurchaseOrderRecord = await prisma.purchaseOrderRecord.delete({
     *   where: {
     *     // ... filter to delete one PurchaseOrderRecord
     *   }
     * })
     * 
     */
    delete<T extends PurchaseOrderRecordDeleteArgs>(args: SelectSubset<T, PurchaseOrderRecordDeleteArgs<ExtArgs>>): Prisma__PurchaseOrderRecordClient<$Result.GetResult<Prisma.$PurchaseOrderRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PurchaseOrderRecord.
     * @param {PurchaseOrderRecordUpdateArgs} args - Arguments to update one PurchaseOrderRecord.
     * @example
     * // Update one PurchaseOrderRecord
     * const purchaseOrderRecord = await prisma.purchaseOrderRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PurchaseOrderRecordUpdateArgs>(args: SelectSubset<T, PurchaseOrderRecordUpdateArgs<ExtArgs>>): Prisma__PurchaseOrderRecordClient<$Result.GetResult<Prisma.$PurchaseOrderRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PurchaseOrderRecords.
     * @param {PurchaseOrderRecordDeleteManyArgs} args - Arguments to filter PurchaseOrderRecords to delete.
     * @example
     * // Delete a few PurchaseOrderRecords
     * const { count } = await prisma.purchaseOrderRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PurchaseOrderRecordDeleteManyArgs>(args?: SelectSubset<T, PurchaseOrderRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseOrderRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PurchaseOrderRecords
     * const purchaseOrderRecord = await prisma.purchaseOrderRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PurchaseOrderRecordUpdateManyArgs>(args: SelectSubset<T, PurchaseOrderRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PurchaseOrderRecords and returns the data updated in the database.
     * @param {PurchaseOrderRecordUpdateManyAndReturnArgs} args - Arguments to update many PurchaseOrderRecords.
     * @example
     * // Update many PurchaseOrderRecords
     * const purchaseOrderRecord = await prisma.purchaseOrderRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PurchaseOrderRecords and only return the `localId`
     * const purchaseOrderRecordWithLocalIdOnly = await prisma.purchaseOrderRecord.updateManyAndReturn({
     *   select: { localId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PurchaseOrderRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, PurchaseOrderRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PurchaseOrderRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PurchaseOrderRecord.
     * @param {PurchaseOrderRecordUpsertArgs} args - Arguments to update or create a PurchaseOrderRecord.
     * @example
     * // Update or create a PurchaseOrderRecord
     * const purchaseOrderRecord = await prisma.purchaseOrderRecord.upsert({
     *   create: {
     *     // ... data to create a PurchaseOrderRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PurchaseOrderRecord we want to update
     *   }
     * })
     */
    upsert<T extends PurchaseOrderRecordUpsertArgs>(args: SelectSubset<T, PurchaseOrderRecordUpsertArgs<ExtArgs>>): Prisma__PurchaseOrderRecordClient<$Result.GetResult<Prisma.$PurchaseOrderRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PurchaseOrderRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderRecordCountArgs} args - Arguments to filter PurchaseOrderRecords to count.
     * @example
     * // Count the number of PurchaseOrderRecords
     * const count = await prisma.purchaseOrderRecord.count({
     *   where: {
     *     // ... the filter for the PurchaseOrderRecords we want to count
     *   }
     * })
    **/
    count<T extends PurchaseOrderRecordCountArgs>(
      args?: Subset<T, PurchaseOrderRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PurchaseOrderRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PurchaseOrderRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PurchaseOrderRecordAggregateArgs>(args: Subset<T, PurchaseOrderRecordAggregateArgs>): Prisma.PrismaPromise<GetPurchaseOrderRecordAggregateType<T>>

    /**
     * Group by PurchaseOrderRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PurchaseOrderRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PurchaseOrderRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PurchaseOrderRecordGroupByArgs['orderBy'] }
        : { orderBy?: PurchaseOrderRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PurchaseOrderRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPurchaseOrderRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PurchaseOrderRecord model
   */
  readonly fields: PurchaseOrderRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PurchaseOrderRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PurchaseOrderRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PurchaseOrderRecord model
   */
  interface PurchaseOrderRecordFieldRefs {
    readonly localId: FieldRef<"PurchaseOrderRecord", 'String'>
    readonly payload: FieldRef<"PurchaseOrderRecord", 'Json'>
    readonly createdAt: FieldRef<"PurchaseOrderRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"PurchaseOrderRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PurchaseOrderRecord findUnique
   */
  export type PurchaseOrderRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderRecord
     */
    select?: PurchaseOrderRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderRecord
     */
    omit?: PurchaseOrderRecordOmit<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderRecord to fetch.
     */
    where: PurchaseOrderRecordWhereUniqueInput
  }

  /**
   * PurchaseOrderRecord findUniqueOrThrow
   */
  export type PurchaseOrderRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderRecord
     */
    select?: PurchaseOrderRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderRecord
     */
    omit?: PurchaseOrderRecordOmit<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderRecord to fetch.
     */
    where: PurchaseOrderRecordWhereUniqueInput
  }

  /**
   * PurchaseOrderRecord findFirst
   */
  export type PurchaseOrderRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderRecord
     */
    select?: PurchaseOrderRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderRecord
     */
    omit?: PurchaseOrderRecordOmit<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderRecord to fetch.
     */
    where?: PurchaseOrderRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrderRecords to fetch.
     */
    orderBy?: PurchaseOrderRecordOrderByWithRelationInput | PurchaseOrderRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseOrderRecords.
     */
    cursor?: PurchaseOrderRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrderRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrderRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseOrderRecords.
     */
    distinct?: PurchaseOrderRecordScalarFieldEnum | PurchaseOrderRecordScalarFieldEnum[]
  }

  /**
   * PurchaseOrderRecord findFirstOrThrow
   */
  export type PurchaseOrderRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderRecord
     */
    select?: PurchaseOrderRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderRecord
     */
    omit?: PurchaseOrderRecordOmit<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderRecord to fetch.
     */
    where?: PurchaseOrderRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrderRecords to fetch.
     */
    orderBy?: PurchaseOrderRecordOrderByWithRelationInput | PurchaseOrderRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PurchaseOrderRecords.
     */
    cursor?: PurchaseOrderRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrderRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrderRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PurchaseOrderRecords.
     */
    distinct?: PurchaseOrderRecordScalarFieldEnum | PurchaseOrderRecordScalarFieldEnum[]
  }

  /**
   * PurchaseOrderRecord findMany
   */
  export type PurchaseOrderRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderRecord
     */
    select?: PurchaseOrderRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderRecord
     */
    omit?: PurchaseOrderRecordOmit<ExtArgs> | null
    /**
     * Filter, which PurchaseOrderRecords to fetch.
     */
    where?: PurchaseOrderRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PurchaseOrderRecords to fetch.
     */
    orderBy?: PurchaseOrderRecordOrderByWithRelationInput | PurchaseOrderRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PurchaseOrderRecords.
     */
    cursor?: PurchaseOrderRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PurchaseOrderRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PurchaseOrderRecords.
     */
    skip?: number
    distinct?: PurchaseOrderRecordScalarFieldEnum | PurchaseOrderRecordScalarFieldEnum[]
  }

  /**
   * PurchaseOrderRecord create
   */
  export type PurchaseOrderRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderRecord
     */
    select?: PurchaseOrderRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderRecord
     */
    omit?: PurchaseOrderRecordOmit<ExtArgs> | null
    /**
     * The data needed to create a PurchaseOrderRecord.
     */
    data: XOR<PurchaseOrderRecordCreateInput, PurchaseOrderRecordUncheckedCreateInput>
  }

  /**
   * PurchaseOrderRecord createMany
   */
  export type PurchaseOrderRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PurchaseOrderRecords.
     */
    data: PurchaseOrderRecordCreateManyInput | PurchaseOrderRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PurchaseOrderRecord createManyAndReturn
   */
  export type PurchaseOrderRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderRecord
     */
    select?: PurchaseOrderRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderRecord
     */
    omit?: PurchaseOrderRecordOmit<ExtArgs> | null
    /**
     * The data used to create many PurchaseOrderRecords.
     */
    data: PurchaseOrderRecordCreateManyInput | PurchaseOrderRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PurchaseOrderRecord update
   */
  export type PurchaseOrderRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderRecord
     */
    select?: PurchaseOrderRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderRecord
     */
    omit?: PurchaseOrderRecordOmit<ExtArgs> | null
    /**
     * The data needed to update a PurchaseOrderRecord.
     */
    data: XOR<PurchaseOrderRecordUpdateInput, PurchaseOrderRecordUncheckedUpdateInput>
    /**
     * Choose, which PurchaseOrderRecord to update.
     */
    where: PurchaseOrderRecordWhereUniqueInput
  }

  /**
   * PurchaseOrderRecord updateMany
   */
  export type PurchaseOrderRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PurchaseOrderRecords.
     */
    data: XOR<PurchaseOrderRecordUpdateManyMutationInput, PurchaseOrderRecordUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseOrderRecords to update
     */
    where?: PurchaseOrderRecordWhereInput
    /**
     * Limit how many PurchaseOrderRecords to update.
     */
    limit?: number
  }

  /**
   * PurchaseOrderRecord updateManyAndReturn
   */
  export type PurchaseOrderRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderRecord
     */
    select?: PurchaseOrderRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderRecord
     */
    omit?: PurchaseOrderRecordOmit<ExtArgs> | null
    /**
     * The data used to update PurchaseOrderRecords.
     */
    data: XOR<PurchaseOrderRecordUpdateManyMutationInput, PurchaseOrderRecordUncheckedUpdateManyInput>
    /**
     * Filter which PurchaseOrderRecords to update
     */
    where?: PurchaseOrderRecordWhereInput
    /**
     * Limit how many PurchaseOrderRecords to update.
     */
    limit?: number
  }

  /**
   * PurchaseOrderRecord upsert
   */
  export type PurchaseOrderRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderRecord
     */
    select?: PurchaseOrderRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderRecord
     */
    omit?: PurchaseOrderRecordOmit<ExtArgs> | null
    /**
     * The filter to search for the PurchaseOrderRecord to update in case it exists.
     */
    where: PurchaseOrderRecordWhereUniqueInput
    /**
     * In case the PurchaseOrderRecord found by the `where` argument doesn't exist, create a new PurchaseOrderRecord with this data.
     */
    create: XOR<PurchaseOrderRecordCreateInput, PurchaseOrderRecordUncheckedCreateInput>
    /**
     * In case the PurchaseOrderRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PurchaseOrderRecordUpdateInput, PurchaseOrderRecordUncheckedUpdateInput>
  }

  /**
   * PurchaseOrderRecord delete
   */
  export type PurchaseOrderRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderRecord
     */
    select?: PurchaseOrderRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderRecord
     */
    omit?: PurchaseOrderRecordOmit<ExtArgs> | null
    /**
     * Filter which PurchaseOrderRecord to delete.
     */
    where: PurchaseOrderRecordWhereUniqueInput
  }

  /**
   * PurchaseOrderRecord deleteMany
   */
  export type PurchaseOrderRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PurchaseOrderRecords to delete
     */
    where?: PurchaseOrderRecordWhereInput
    /**
     * Limit how many PurchaseOrderRecords to delete.
     */
    limit?: number
  }

  /**
   * PurchaseOrderRecord without action
   */
  export type PurchaseOrderRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PurchaseOrderRecord
     */
    select?: PurchaseOrderRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PurchaseOrderRecord
     */
    omit?: PurchaseOrderRecordOmit<ExtArgs> | null
  }


  /**
   * Model SupplierOrderAcknowledgementRecord
   */

  export type AggregateSupplierOrderAcknowledgementRecord = {
    _count: SupplierOrderAcknowledgementRecordCountAggregateOutputType | null
    _min: SupplierOrderAcknowledgementRecordMinAggregateOutputType | null
    _max: SupplierOrderAcknowledgementRecordMaxAggregateOutputType | null
  }

  export type SupplierOrderAcknowledgementRecordMinAggregateOutputType = {
    localId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierOrderAcknowledgementRecordMaxAggregateOutputType = {
    localId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierOrderAcknowledgementRecordCountAggregateOutputType = {
    localId: number
    payload: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SupplierOrderAcknowledgementRecordMinAggregateInputType = {
    localId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierOrderAcknowledgementRecordMaxAggregateInputType = {
    localId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierOrderAcknowledgementRecordCountAggregateInputType = {
    localId?: true
    payload?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SupplierOrderAcknowledgementRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupplierOrderAcknowledgementRecord to aggregate.
     */
    where?: SupplierOrderAcknowledgementRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierOrderAcknowledgementRecords to fetch.
     */
    orderBy?: SupplierOrderAcknowledgementRecordOrderByWithRelationInput | SupplierOrderAcknowledgementRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupplierOrderAcknowledgementRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierOrderAcknowledgementRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierOrderAcknowledgementRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SupplierOrderAcknowledgementRecords
    **/
    _count?: true | SupplierOrderAcknowledgementRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupplierOrderAcknowledgementRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupplierOrderAcknowledgementRecordMaxAggregateInputType
  }

  export type GetSupplierOrderAcknowledgementRecordAggregateType<T extends SupplierOrderAcknowledgementRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateSupplierOrderAcknowledgementRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupplierOrderAcknowledgementRecord[P]>
      : GetScalarType<T[P], AggregateSupplierOrderAcknowledgementRecord[P]>
  }




  export type SupplierOrderAcknowledgementRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupplierOrderAcknowledgementRecordWhereInput
    orderBy?: SupplierOrderAcknowledgementRecordOrderByWithAggregationInput | SupplierOrderAcknowledgementRecordOrderByWithAggregationInput[]
    by: SupplierOrderAcknowledgementRecordScalarFieldEnum[] | SupplierOrderAcknowledgementRecordScalarFieldEnum
    having?: SupplierOrderAcknowledgementRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupplierOrderAcknowledgementRecordCountAggregateInputType | true
    _min?: SupplierOrderAcknowledgementRecordMinAggregateInputType
    _max?: SupplierOrderAcknowledgementRecordMaxAggregateInputType
  }

  export type SupplierOrderAcknowledgementRecordGroupByOutputType = {
    localId: string
    payload: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: SupplierOrderAcknowledgementRecordCountAggregateOutputType | null
    _min: SupplierOrderAcknowledgementRecordMinAggregateOutputType | null
    _max: SupplierOrderAcknowledgementRecordMaxAggregateOutputType | null
  }

  type GetSupplierOrderAcknowledgementRecordGroupByPayload<T extends SupplierOrderAcknowledgementRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupplierOrderAcknowledgementRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupplierOrderAcknowledgementRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupplierOrderAcknowledgementRecordGroupByOutputType[P]>
            : GetScalarType<T[P], SupplierOrderAcknowledgementRecordGroupByOutputType[P]>
        }
      >
    >


  export type SupplierOrderAcknowledgementRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplierOrderAcknowledgementRecord"]>

  export type SupplierOrderAcknowledgementRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplierOrderAcknowledgementRecord"]>

  export type SupplierOrderAcknowledgementRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplierOrderAcknowledgementRecord"]>

  export type SupplierOrderAcknowledgementRecordSelectScalar = {
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SupplierOrderAcknowledgementRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"localId" | "payload" | "createdAt" | "updatedAt", ExtArgs["result"]["supplierOrderAcknowledgementRecord"]>

  export type $SupplierOrderAcknowledgementRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SupplierOrderAcknowledgementRecord"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      localId: string
      payload: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["supplierOrderAcknowledgementRecord"]>
    composites: {}
  }

  type SupplierOrderAcknowledgementRecordGetPayload<S extends boolean | null | undefined | SupplierOrderAcknowledgementRecordDefaultArgs> = $Result.GetResult<Prisma.$SupplierOrderAcknowledgementRecordPayload, S>

  type SupplierOrderAcknowledgementRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SupplierOrderAcknowledgementRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SupplierOrderAcknowledgementRecordCountAggregateInputType | true
    }

  export interface SupplierOrderAcknowledgementRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SupplierOrderAcknowledgementRecord'], meta: { name: 'SupplierOrderAcknowledgementRecord' } }
    /**
     * Find zero or one SupplierOrderAcknowledgementRecord that matches the filter.
     * @param {SupplierOrderAcknowledgementRecordFindUniqueArgs} args - Arguments to find a SupplierOrderAcknowledgementRecord
     * @example
     * // Get one SupplierOrderAcknowledgementRecord
     * const supplierOrderAcknowledgementRecord = await prisma.supplierOrderAcknowledgementRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupplierOrderAcknowledgementRecordFindUniqueArgs>(args: SelectSubset<T, SupplierOrderAcknowledgementRecordFindUniqueArgs<ExtArgs>>): Prisma__SupplierOrderAcknowledgementRecordClient<$Result.GetResult<Prisma.$SupplierOrderAcknowledgementRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SupplierOrderAcknowledgementRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SupplierOrderAcknowledgementRecordFindUniqueOrThrowArgs} args - Arguments to find a SupplierOrderAcknowledgementRecord
     * @example
     * // Get one SupplierOrderAcknowledgementRecord
     * const supplierOrderAcknowledgementRecord = await prisma.supplierOrderAcknowledgementRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupplierOrderAcknowledgementRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, SupplierOrderAcknowledgementRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupplierOrderAcknowledgementRecordClient<$Result.GetResult<Prisma.$SupplierOrderAcknowledgementRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SupplierOrderAcknowledgementRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderAcknowledgementRecordFindFirstArgs} args - Arguments to find a SupplierOrderAcknowledgementRecord
     * @example
     * // Get one SupplierOrderAcknowledgementRecord
     * const supplierOrderAcknowledgementRecord = await prisma.supplierOrderAcknowledgementRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupplierOrderAcknowledgementRecordFindFirstArgs>(args?: SelectSubset<T, SupplierOrderAcknowledgementRecordFindFirstArgs<ExtArgs>>): Prisma__SupplierOrderAcknowledgementRecordClient<$Result.GetResult<Prisma.$SupplierOrderAcknowledgementRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SupplierOrderAcknowledgementRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderAcknowledgementRecordFindFirstOrThrowArgs} args - Arguments to find a SupplierOrderAcknowledgementRecord
     * @example
     * // Get one SupplierOrderAcknowledgementRecord
     * const supplierOrderAcknowledgementRecord = await prisma.supplierOrderAcknowledgementRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupplierOrderAcknowledgementRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, SupplierOrderAcknowledgementRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupplierOrderAcknowledgementRecordClient<$Result.GetResult<Prisma.$SupplierOrderAcknowledgementRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SupplierOrderAcknowledgementRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderAcknowledgementRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SupplierOrderAcknowledgementRecords
     * const supplierOrderAcknowledgementRecords = await prisma.supplierOrderAcknowledgementRecord.findMany()
     * 
     * // Get first 10 SupplierOrderAcknowledgementRecords
     * const supplierOrderAcknowledgementRecords = await prisma.supplierOrderAcknowledgementRecord.findMany({ take: 10 })
     * 
     * // Only select the `localId`
     * const supplierOrderAcknowledgementRecordWithLocalIdOnly = await prisma.supplierOrderAcknowledgementRecord.findMany({ select: { localId: true } })
     * 
     */
    findMany<T extends SupplierOrderAcknowledgementRecordFindManyArgs>(args?: SelectSubset<T, SupplierOrderAcknowledgementRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierOrderAcknowledgementRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SupplierOrderAcknowledgementRecord.
     * @param {SupplierOrderAcknowledgementRecordCreateArgs} args - Arguments to create a SupplierOrderAcknowledgementRecord.
     * @example
     * // Create one SupplierOrderAcknowledgementRecord
     * const SupplierOrderAcknowledgementRecord = await prisma.supplierOrderAcknowledgementRecord.create({
     *   data: {
     *     // ... data to create a SupplierOrderAcknowledgementRecord
     *   }
     * })
     * 
     */
    create<T extends SupplierOrderAcknowledgementRecordCreateArgs>(args: SelectSubset<T, SupplierOrderAcknowledgementRecordCreateArgs<ExtArgs>>): Prisma__SupplierOrderAcknowledgementRecordClient<$Result.GetResult<Prisma.$SupplierOrderAcknowledgementRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SupplierOrderAcknowledgementRecords.
     * @param {SupplierOrderAcknowledgementRecordCreateManyArgs} args - Arguments to create many SupplierOrderAcknowledgementRecords.
     * @example
     * // Create many SupplierOrderAcknowledgementRecords
     * const supplierOrderAcknowledgementRecord = await prisma.supplierOrderAcknowledgementRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupplierOrderAcknowledgementRecordCreateManyArgs>(args?: SelectSubset<T, SupplierOrderAcknowledgementRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SupplierOrderAcknowledgementRecords and returns the data saved in the database.
     * @param {SupplierOrderAcknowledgementRecordCreateManyAndReturnArgs} args - Arguments to create many SupplierOrderAcknowledgementRecords.
     * @example
     * // Create many SupplierOrderAcknowledgementRecords
     * const supplierOrderAcknowledgementRecord = await prisma.supplierOrderAcknowledgementRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SupplierOrderAcknowledgementRecords and only return the `localId`
     * const supplierOrderAcknowledgementRecordWithLocalIdOnly = await prisma.supplierOrderAcknowledgementRecord.createManyAndReturn({
     *   select: { localId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SupplierOrderAcknowledgementRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, SupplierOrderAcknowledgementRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierOrderAcknowledgementRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SupplierOrderAcknowledgementRecord.
     * @param {SupplierOrderAcknowledgementRecordDeleteArgs} args - Arguments to delete one SupplierOrderAcknowledgementRecord.
     * @example
     * // Delete one SupplierOrderAcknowledgementRecord
     * const SupplierOrderAcknowledgementRecord = await prisma.supplierOrderAcknowledgementRecord.delete({
     *   where: {
     *     // ... filter to delete one SupplierOrderAcknowledgementRecord
     *   }
     * })
     * 
     */
    delete<T extends SupplierOrderAcknowledgementRecordDeleteArgs>(args: SelectSubset<T, SupplierOrderAcknowledgementRecordDeleteArgs<ExtArgs>>): Prisma__SupplierOrderAcknowledgementRecordClient<$Result.GetResult<Prisma.$SupplierOrderAcknowledgementRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SupplierOrderAcknowledgementRecord.
     * @param {SupplierOrderAcknowledgementRecordUpdateArgs} args - Arguments to update one SupplierOrderAcknowledgementRecord.
     * @example
     * // Update one SupplierOrderAcknowledgementRecord
     * const supplierOrderAcknowledgementRecord = await prisma.supplierOrderAcknowledgementRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupplierOrderAcknowledgementRecordUpdateArgs>(args: SelectSubset<T, SupplierOrderAcknowledgementRecordUpdateArgs<ExtArgs>>): Prisma__SupplierOrderAcknowledgementRecordClient<$Result.GetResult<Prisma.$SupplierOrderAcknowledgementRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SupplierOrderAcknowledgementRecords.
     * @param {SupplierOrderAcknowledgementRecordDeleteManyArgs} args - Arguments to filter SupplierOrderAcknowledgementRecords to delete.
     * @example
     * // Delete a few SupplierOrderAcknowledgementRecords
     * const { count } = await prisma.supplierOrderAcknowledgementRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupplierOrderAcknowledgementRecordDeleteManyArgs>(args?: SelectSubset<T, SupplierOrderAcknowledgementRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SupplierOrderAcknowledgementRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderAcknowledgementRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SupplierOrderAcknowledgementRecords
     * const supplierOrderAcknowledgementRecord = await prisma.supplierOrderAcknowledgementRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupplierOrderAcknowledgementRecordUpdateManyArgs>(args: SelectSubset<T, SupplierOrderAcknowledgementRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SupplierOrderAcknowledgementRecords and returns the data updated in the database.
     * @param {SupplierOrderAcknowledgementRecordUpdateManyAndReturnArgs} args - Arguments to update many SupplierOrderAcknowledgementRecords.
     * @example
     * // Update many SupplierOrderAcknowledgementRecords
     * const supplierOrderAcknowledgementRecord = await prisma.supplierOrderAcknowledgementRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SupplierOrderAcknowledgementRecords and only return the `localId`
     * const supplierOrderAcknowledgementRecordWithLocalIdOnly = await prisma.supplierOrderAcknowledgementRecord.updateManyAndReturn({
     *   select: { localId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SupplierOrderAcknowledgementRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, SupplierOrderAcknowledgementRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierOrderAcknowledgementRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SupplierOrderAcknowledgementRecord.
     * @param {SupplierOrderAcknowledgementRecordUpsertArgs} args - Arguments to update or create a SupplierOrderAcknowledgementRecord.
     * @example
     * // Update or create a SupplierOrderAcknowledgementRecord
     * const supplierOrderAcknowledgementRecord = await prisma.supplierOrderAcknowledgementRecord.upsert({
     *   create: {
     *     // ... data to create a SupplierOrderAcknowledgementRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SupplierOrderAcknowledgementRecord we want to update
     *   }
     * })
     */
    upsert<T extends SupplierOrderAcknowledgementRecordUpsertArgs>(args: SelectSubset<T, SupplierOrderAcknowledgementRecordUpsertArgs<ExtArgs>>): Prisma__SupplierOrderAcknowledgementRecordClient<$Result.GetResult<Prisma.$SupplierOrderAcknowledgementRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SupplierOrderAcknowledgementRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderAcknowledgementRecordCountArgs} args - Arguments to filter SupplierOrderAcknowledgementRecords to count.
     * @example
     * // Count the number of SupplierOrderAcknowledgementRecords
     * const count = await prisma.supplierOrderAcknowledgementRecord.count({
     *   where: {
     *     // ... the filter for the SupplierOrderAcknowledgementRecords we want to count
     *   }
     * })
    **/
    count<T extends SupplierOrderAcknowledgementRecordCountArgs>(
      args?: Subset<T, SupplierOrderAcknowledgementRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupplierOrderAcknowledgementRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SupplierOrderAcknowledgementRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderAcknowledgementRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SupplierOrderAcknowledgementRecordAggregateArgs>(args: Subset<T, SupplierOrderAcknowledgementRecordAggregateArgs>): Prisma.PrismaPromise<GetSupplierOrderAcknowledgementRecordAggregateType<T>>

    /**
     * Group by SupplierOrderAcknowledgementRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierOrderAcknowledgementRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SupplierOrderAcknowledgementRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupplierOrderAcknowledgementRecordGroupByArgs['orderBy'] }
        : { orderBy?: SupplierOrderAcknowledgementRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SupplierOrderAcknowledgementRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierOrderAcknowledgementRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SupplierOrderAcknowledgementRecord model
   */
  readonly fields: SupplierOrderAcknowledgementRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SupplierOrderAcknowledgementRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupplierOrderAcknowledgementRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SupplierOrderAcknowledgementRecord model
   */
  interface SupplierOrderAcknowledgementRecordFieldRefs {
    readonly localId: FieldRef<"SupplierOrderAcknowledgementRecord", 'String'>
    readonly payload: FieldRef<"SupplierOrderAcknowledgementRecord", 'Json'>
    readonly createdAt: FieldRef<"SupplierOrderAcknowledgementRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"SupplierOrderAcknowledgementRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SupplierOrderAcknowledgementRecord findUnique
   */
  export type SupplierOrderAcknowledgementRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrderAcknowledgementRecord
     */
    select?: SupplierOrderAcknowledgementRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrderAcknowledgementRecord
     */
    omit?: SupplierOrderAcknowledgementRecordOmit<ExtArgs> | null
    /**
     * Filter, which SupplierOrderAcknowledgementRecord to fetch.
     */
    where: SupplierOrderAcknowledgementRecordWhereUniqueInput
  }

  /**
   * SupplierOrderAcknowledgementRecord findUniqueOrThrow
   */
  export type SupplierOrderAcknowledgementRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrderAcknowledgementRecord
     */
    select?: SupplierOrderAcknowledgementRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrderAcknowledgementRecord
     */
    omit?: SupplierOrderAcknowledgementRecordOmit<ExtArgs> | null
    /**
     * Filter, which SupplierOrderAcknowledgementRecord to fetch.
     */
    where: SupplierOrderAcknowledgementRecordWhereUniqueInput
  }

  /**
   * SupplierOrderAcknowledgementRecord findFirst
   */
  export type SupplierOrderAcknowledgementRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrderAcknowledgementRecord
     */
    select?: SupplierOrderAcknowledgementRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrderAcknowledgementRecord
     */
    omit?: SupplierOrderAcknowledgementRecordOmit<ExtArgs> | null
    /**
     * Filter, which SupplierOrderAcknowledgementRecord to fetch.
     */
    where?: SupplierOrderAcknowledgementRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierOrderAcknowledgementRecords to fetch.
     */
    orderBy?: SupplierOrderAcknowledgementRecordOrderByWithRelationInput | SupplierOrderAcknowledgementRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupplierOrderAcknowledgementRecords.
     */
    cursor?: SupplierOrderAcknowledgementRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierOrderAcknowledgementRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierOrderAcknowledgementRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupplierOrderAcknowledgementRecords.
     */
    distinct?: SupplierOrderAcknowledgementRecordScalarFieldEnum | SupplierOrderAcknowledgementRecordScalarFieldEnum[]
  }

  /**
   * SupplierOrderAcknowledgementRecord findFirstOrThrow
   */
  export type SupplierOrderAcknowledgementRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrderAcknowledgementRecord
     */
    select?: SupplierOrderAcknowledgementRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrderAcknowledgementRecord
     */
    omit?: SupplierOrderAcknowledgementRecordOmit<ExtArgs> | null
    /**
     * Filter, which SupplierOrderAcknowledgementRecord to fetch.
     */
    where?: SupplierOrderAcknowledgementRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierOrderAcknowledgementRecords to fetch.
     */
    orderBy?: SupplierOrderAcknowledgementRecordOrderByWithRelationInput | SupplierOrderAcknowledgementRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupplierOrderAcknowledgementRecords.
     */
    cursor?: SupplierOrderAcknowledgementRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierOrderAcknowledgementRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierOrderAcknowledgementRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupplierOrderAcknowledgementRecords.
     */
    distinct?: SupplierOrderAcknowledgementRecordScalarFieldEnum | SupplierOrderAcknowledgementRecordScalarFieldEnum[]
  }

  /**
   * SupplierOrderAcknowledgementRecord findMany
   */
  export type SupplierOrderAcknowledgementRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrderAcknowledgementRecord
     */
    select?: SupplierOrderAcknowledgementRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrderAcknowledgementRecord
     */
    omit?: SupplierOrderAcknowledgementRecordOmit<ExtArgs> | null
    /**
     * Filter, which SupplierOrderAcknowledgementRecords to fetch.
     */
    where?: SupplierOrderAcknowledgementRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierOrderAcknowledgementRecords to fetch.
     */
    orderBy?: SupplierOrderAcknowledgementRecordOrderByWithRelationInput | SupplierOrderAcknowledgementRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SupplierOrderAcknowledgementRecords.
     */
    cursor?: SupplierOrderAcknowledgementRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierOrderAcknowledgementRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierOrderAcknowledgementRecords.
     */
    skip?: number
    distinct?: SupplierOrderAcknowledgementRecordScalarFieldEnum | SupplierOrderAcknowledgementRecordScalarFieldEnum[]
  }

  /**
   * SupplierOrderAcknowledgementRecord create
   */
  export type SupplierOrderAcknowledgementRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrderAcknowledgementRecord
     */
    select?: SupplierOrderAcknowledgementRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrderAcknowledgementRecord
     */
    omit?: SupplierOrderAcknowledgementRecordOmit<ExtArgs> | null
    /**
     * The data needed to create a SupplierOrderAcknowledgementRecord.
     */
    data: XOR<SupplierOrderAcknowledgementRecordCreateInput, SupplierOrderAcknowledgementRecordUncheckedCreateInput>
  }

  /**
   * SupplierOrderAcknowledgementRecord createMany
   */
  export type SupplierOrderAcknowledgementRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SupplierOrderAcknowledgementRecords.
     */
    data: SupplierOrderAcknowledgementRecordCreateManyInput | SupplierOrderAcknowledgementRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SupplierOrderAcknowledgementRecord createManyAndReturn
   */
  export type SupplierOrderAcknowledgementRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrderAcknowledgementRecord
     */
    select?: SupplierOrderAcknowledgementRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrderAcknowledgementRecord
     */
    omit?: SupplierOrderAcknowledgementRecordOmit<ExtArgs> | null
    /**
     * The data used to create many SupplierOrderAcknowledgementRecords.
     */
    data: SupplierOrderAcknowledgementRecordCreateManyInput | SupplierOrderAcknowledgementRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SupplierOrderAcknowledgementRecord update
   */
  export type SupplierOrderAcknowledgementRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrderAcknowledgementRecord
     */
    select?: SupplierOrderAcknowledgementRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrderAcknowledgementRecord
     */
    omit?: SupplierOrderAcknowledgementRecordOmit<ExtArgs> | null
    /**
     * The data needed to update a SupplierOrderAcknowledgementRecord.
     */
    data: XOR<SupplierOrderAcknowledgementRecordUpdateInput, SupplierOrderAcknowledgementRecordUncheckedUpdateInput>
    /**
     * Choose, which SupplierOrderAcknowledgementRecord to update.
     */
    where: SupplierOrderAcknowledgementRecordWhereUniqueInput
  }

  /**
   * SupplierOrderAcknowledgementRecord updateMany
   */
  export type SupplierOrderAcknowledgementRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SupplierOrderAcknowledgementRecords.
     */
    data: XOR<SupplierOrderAcknowledgementRecordUpdateManyMutationInput, SupplierOrderAcknowledgementRecordUncheckedUpdateManyInput>
    /**
     * Filter which SupplierOrderAcknowledgementRecords to update
     */
    where?: SupplierOrderAcknowledgementRecordWhereInput
    /**
     * Limit how many SupplierOrderAcknowledgementRecords to update.
     */
    limit?: number
  }

  /**
   * SupplierOrderAcknowledgementRecord updateManyAndReturn
   */
  export type SupplierOrderAcknowledgementRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrderAcknowledgementRecord
     */
    select?: SupplierOrderAcknowledgementRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrderAcknowledgementRecord
     */
    omit?: SupplierOrderAcknowledgementRecordOmit<ExtArgs> | null
    /**
     * The data used to update SupplierOrderAcknowledgementRecords.
     */
    data: XOR<SupplierOrderAcknowledgementRecordUpdateManyMutationInput, SupplierOrderAcknowledgementRecordUncheckedUpdateManyInput>
    /**
     * Filter which SupplierOrderAcknowledgementRecords to update
     */
    where?: SupplierOrderAcknowledgementRecordWhereInput
    /**
     * Limit how many SupplierOrderAcknowledgementRecords to update.
     */
    limit?: number
  }

  /**
   * SupplierOrderAcknowledgementRecord upsert
   */
  export type SupplierOrderAcknowledgementRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrderAcknowledgementRecord
     */
    select?: SupplierOrderAcknowledgementRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrderAcknowledgementRecord
     */
    omit?: SupplierOrderAcknowledgementRecordOmit<ExtArgs> | null
    /**
     * The filter to search for the SupplierOrderAcknowledgementRecord to update in case it exists.
     */
    where: SupplierOrderAcknowledgementRecordWhereUniqueInput
    /**
     * In case the SupplierOrderAcknowledgementRecord found by the `where` argument doesn't exist, create a new SupplierOrderAcknowledgementRecord with this data.
     */
    create: XOR<SupplierOrderAcknowledgementRecordCreateInput, SupplierOrderAcknowledgementRecordUncheckedCreateInput>
    /**
     * In case the SupplierOrderAcknowledgementRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupplierOrderAcknowledgementRecordUpdateInput, SupplierOrderAcknowledgementRecordUncheckedUpdateInput>
  }

  /**
   * SupplierOrderAcknowledgementRecord delete
   */
  export type SupplierOrderAcknowledgementRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrderAcknowledgementRecord
     */
    select?: SupplierOrderAcknowledgementRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrderAcknowledgementRecord
     */
    omit?: SupplierOrderAcknowledgementRecordOmit<ExtArgs> | null
    /**
     * Filter which SupplierOrderAcknowledgementRecord to delete.
     */
    where: SupplierOrderAcknowledgementRecordWhereUniqueInput
  }

  /**
   * SupplierOrderAcknowledgementRecord deleteMany
   */
  export type SupplierOrderAcknowledgementRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupplierOrderAcknowledgementRecords to delete
     */
    where?: SupplierOrderAcknowledgementRecordWhereInput
    /**
     * Limit how many SupplierOrderAcknowledgementRecords to delete.
     */
    limit?: number
  }

  /**
   * SupplierOrderAcknowledgementRecord without action
   */
  export type SupplierOrderAcknowledgementRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierOrderAcknowledgementRecord
     */
    select?: SupplierOrderAcknowledgementRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierOrderAcknowledgementRecord
     */
    omit?: SupplierOrderAcknowledgementRecordOmit<ExtArgs> | null
  }


  /**
   * Model SupplierDeliveryRecordStore
   */

  export type AggregateSupplierDeliveryRecordStore = {
    _count: SupplierDeliveryRecordStoreCountAggregateOutputType | null
    _min: SupplierDeliveryRecordStoreMinAggregateOutputType | null
    _max: SupplierDeliveryRecordStoreMaxAggregateOutputType | null
  }

  export type SupplierDeliveryRecordStoreMinAggregateOutputType = {
    localId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierDeliveryRecordStoreMaxAggregateOutputType = {
    localId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierDeliveryRecordStoreCountAggregateOutputType = {
    localId: number
    payload: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SupplierDeliveryRecordStoreMinAggregateInputType = {
    localId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierDeliveryRecordStoreMaxAggregateInputType = {
    localId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierDeliveryRecordStoreCountAggregateInputType = {
    localId?: true
    payload?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SupplierDeliveryRecordStoreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupplierDeliveryRecordStore to aggregate.
     */
    where?: SupplierDeliveryRecordStoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierDeliveryRecordStores to fetch.
     */
    orderBy?: SupplierDeliveryRecordStoreOrderByWithRelationInput | SupplierDeliveryRecordStoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupplierDeliveryRecordStoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierDeliveryRecordStores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierDeliveryRecordStores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SupplierDeliveryRecordStores
    **/
    _count?: true | SupplierDeliveryRecordStoreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupplierDeliveryRecordStoreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupplierDeliveryRecordStoreMaxAggregateInputType
  }

  export type GetSupplierDeliveryRecordStoreAggregateType<T extends SupplierDeliveryRecordStoreAggregateArgs> = {
        [P in keyof T & keyof AggregateSupplierDeliveryRecordStore]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupplierDeliveryRecordStore[P]>
      : GetScalarType<T[P], AggregateSupplierDeliveryRecordStore[P]>
  }




  export type SupplierDeliveryRecordStoreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupplierDeliveryRecordStoreWhereInput
    orderBy?: SupplierDeliveryRecordStoreOrderByWithAggregationInput | SupplierDeliveryRecordStoreOrderByWithAggregationInput[]
    by: SupplierDeliveryRecordStoreScalarFieldEnum[] | SupplierDeliveryRecordStoreScalarFieldEnum
    having?: SupplierDeliveryRecordStoreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupplierDeliveryRecordStoreCountAggregateInputType | true
    _min?: SupplierDeliveryRecordStoreMinAggregateInputType
    _max?: SupplierDeliveryRecordStoreMaxAggregateInputType
  }

  export type SupplierDeliveryRecordStoreGroupByOutputType = {
    localId: string
    payload: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: SupplierDeliveryRecordStoreCountAggregateOutputType | null
    _min: SupplierDeliveryRecordStoreMinAggregateOutputType | null
    _max: SupplierDeliveryRecordStoreMaxAggregateOutputType | null
  }

  type GetSupplierDeliveryRecordStoreGroupByPayload<T extends SupplierDeliveryRecordStoreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupplierDeliveryRecordStoreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupplierDeliveryRecordStoreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupplierDeliveryRecordStoreGroupByOutputType[P]>
            : GetScalarType<T[P], SupplierDeliveryRecordStoreGroupByOutputType[P]>
        }
      >
    >


  export type SupplierDeliveryRecordStoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplierDeliveryRecordStore"]>

  export type SupplierDeliveryRecordStoreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplierDeliveryRecordStore"]>

  export type SupplierDeliveryRecordStoreSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplierDeliveryRecordStore"]>

  export type SupplierDeliveryRecordStoreSelectScalar = {
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SupplierDeliveryRecordStoreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"localId" | "payload" | "createdAt" | "updatedAt", ExtArgs["result"]["supplierDeliveryRecordStore"]>

  export type $SupplierDeliveryRecordStorePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SupplierDeliveryRecordStore"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      localId: string
      payload: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["supplierDeliveryRecordStore"]>
    composites: {}
  }

  type SupplierDeliveryRecordStoreGetPayload<S extends boolean | null | undefined | SupplierDeliveryRecordStoreDefaultArgs> = $Result.GetResult<Prisma.$SupplierDeliveryRecordStorePayload, S>

  type SupplierDeliveryRecordStoreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SupplierDeliveryRecordStoreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SupplierDeliveryRecordStoreCountAggregateInputType | true
    }

  export interface SupplierDeliveryRecordStoreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SupplierDeliveryRecordStore'], meta: { name: 'SupplierDeliveryRecordStore' } }
    /**
     * Find zero or one SupplierDeliveryRecordStore that matches the filter.
     * @param {SupplierDeliveryRecordStoreFindUniqueArgs} args - Arguments to find a SupplierDeliveryRecordStore
     * @example
     * // Get one SupplierDeliveryRecordStore
     * const supplierDeliveryRecordStore = await prisma.supplierDeliveryRecordStore.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupplierDeliveryRecordStoreFindUniqueArgs>(args: SelectSubset<T, SupplierDeliveryRecordStoreFindUniqueArgs<ExtArgs>>): Prisma__SupplierDeliveryRecordStoreClient<$Result.GetResult<Prisma.$SupplierDeliveryRecordStorePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SupplierDeliveryRecordStore that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SupplierDeliveryRecordStoreFindUniqueOrThrowArgs} args - Arguments to find a SupplierDeliveryRecordStore
     * @example
     * // Get one SupplierDeliveryRecordStore
     * const supplierDeliveryRecordStore = await prisma.supplierDeliveryRecordStore.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupplierDeliveryRecordStoreFindUniqueOrThrowArgs>(args: SelectSubset<T, SupplierDeliveryRecordStoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupplierDeliveryRecordStoreClient<$Result.GetResult<Prisma.$SupplierDeliveryRecordStorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SupplierDeliveryRecordStore that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierDeliveryRecordStoreFindFirstArgs} args - Arguments to find a SupplierDeliveryRecordStore
     * @example
     * // Get one SupplierDeliveryRecordStore
     * const supplierDeliveryRecordStore = await prisma.supplierDeliveryRecordStore.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupplierDeliveryRecordStoreFindFirstArgs>(args?: SelectSubset<T, SupplierDeliveryRecordStoreFindFirstArgs<ExtArgs>>): Prisma__SupplierDeliveryRecordStoreClient<$Result.GetResult<Prisma.$SupplierDeliveryRecordStorePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SupplierDeliveryRecordStore that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierDeliveryRecordStoreFindFirstOrThrowArgs} args - Arguments to find a SupplierDeliveryRecordStore
     * @example
     * // Get one SupplierDeliveryRecordStore
     * const supplierDeliveryRecordStore = await prisma.supplierDeliveryRecordStore.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupplierDeliveryRecordStoreFindFirstOrThrowArgs>(args?: SelectSubset<T, SupplierDeliveryRecordStoreFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupplierDeliveryRecordStoreClient<$Result.GetResult<Prisma.$SupplierDeliveryRecordStorePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SupplierDeliveryRecordStores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierDeliveryRecordStoreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SupplierDeliveryRecordStores
     * const supplierDeliveryRecordStores = await prisma.supplierDeliveryRecordStore.findMany()
     * 
     * // Get first 10 SupplierDeliveryRecordStores
     * const supplierDeliveryRecordStores = await prisma.supplierDeliveryRecordStore.findMany({ take: 10 })
     * 
     * // Only select the `localId`
     * const supplierDeliveryRecordStoreWithLocalIdOnly = await prisma.supplierDeliveryRecordStore.findMany({ select: { localId: true } })
     * 
     */
    findMany<T extends SupplierDeliveryRecordStoreFindManyArgs>(args?: SelectSubset<T, SupplierDeliveryRecordStoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierDeliveryRecordStorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SupplierDeliveryRecordStore.
     * @param {SupplierDeliveryRecordStoreCreateArgs} args - Arguments to create a SupplierDeliveryRecordStore.
     * @example
     * // Create one SupplierDeliveryRecordStore
     * const SupplierDeliveryRecordStore = await prisma.supplierDeliveryRecordStore.create({
     *   data: {
     *     // ... data to create a SupplierDeliveryRecordStore
     *   }
     * })
     * 
     */
    create<T extends SupplierDeliveryRecordStoreCreateArgs>(args: SelectSubset<T, SupplierDeliveryRecordStoreCreateArgs<ExtArgs>>): Prisma__SupplierDeliveryRecordStoreClient<$Result.GetResult<Prisma.$SupplierDeliveryRecordStorePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SupplierDeliveryRecordStores.
     * @param {SupplierDeliveryRecordStoreCreateManyArgs} args - Arguments to create many SupplierDeliveryRecordStores.
     * @example
     * // Create many SupplierDeliveryRecordStores
     * const supplierDeliveryRecordStore = await prisma.supplierDeliveryRecordStore.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupplierDeliveryRecordStoreCreateManyArgs>(args?: SelectSubset<T, SupplierDeliveryRecordStoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SupplierDeliveryRecordStores and returns the data saved in the database.
     * @param {SupplierDeliveryRecordStoreCreateManyAndReturnArgs} args - Arguments to create many SupplierDeliveryRecordStores.
     * @example
     * // Create many SupplierDeliveryRecordStores
     * const supplierDeliveryRecordStore = await prisma.supplierDeliveryRecordStore.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SupplierDeliveryRecordStores and only return the `localId`
     * const supplierDeliveryRecordStoreWithLocalIdOnly = await prisma.supplierDeliveryRecordStore.createManyAndReturn({
     *   select: { localId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SupplierDeliveryRecordStoreCreateManyAndReturnArgs>(args?: SelectSubset<T, SupplierDeliveryRecordStoreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierDeliveryRecordStorePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SupplierDeliveryRecordStore.
     * @param {SupplierDeliveryRecordStoreDeleteArgs} args - Arguments to delete one SupplierDeliveryRecordStore.
     * @example
     * // Delete one SupplierDeliveryRecordStore
     * const SupplierDeliveryRecordStore = await prisma.supplierDeliveryRecordStore.delete({
     *   where: {
     *     // ... filter to delete one SupplierDeliveryRecordStore
     *   }
     * })
     * 
     */
    delete<T extends SupplierDeliveryRecordStoreDeleteArgs>(args: SelectSubset<T, SupplierDeliveryRecordStoreDeleteArgs<ExtArgs>>): Prisma__SupplierDeliveryRecordStoreClient<$Result.GetResult<Prisma.$SupplierDeliveryRecordStorePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SupplierDeliveryRecordStore.
     * @param {SupplierDeliveryRecordStoreUpdateArgs} args - Arguments to update one SupplierDeliveryRecordStore.
     * @example
     * // Update one SupplierDeliveryRecordStore
     * const supplierDeliveryRecordStore = await prisma.supplierDeliveryRecordStore.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupplierDeliveryRecordStoreUpdateArgs>(args: SelectSubset<T, SupplierDeliveryRecordStoreUpdateArgs<ExtArgs>>): Prisma__SupplierDeliveryRecordStoreClient<$Result.GetResult<Prisma.$SupplierDeliveryRecordStorePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SupplierDeliveryRecordStores.
     * @param {SupplierDeliveryRecordStoreDeleteManyArgs} args - Arguments to filter SupplierDeliveryRecordStores to delete.
     * @example
     * // Delete a few SupplierDeliveryRecordStores
     * const { count } = await prisma.supplierDeliveryRecordStore.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupplierDeliveryRecordStoreDeleteManyArgs>(args?: SelectSubset<T, SupplierDeliveryRecordStoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SupplierDeliveryRecordStores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierDeliveryRecordStoreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SupplierDeliveryRecordStores
     * const supplierDeliveryRecordStore = await prisma.supplierDeliveryRecordStore.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupplierDeliveryRecordStoreUpdateManyArgs>(args: SelectSubset<T, SupplierDeliveryRecordStoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SupplierDeliveryRecordStores and returns the data updated in the database.
     * @param {SupplierDeliveryRecordStoreUpdateManyAndReturnArgs} args - Arguments to update many SupplierDeliveryRecordStores.
     * @example
     * // Update many SupplierDeliveryRecordStores
     * const supplierDeliveryRecordStore = await prisma.supplierDeliveryRecordStore.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SupplierDeliveryRecordStores and only return the `localId`
     * const supplierDeliveryRecordStoreWithLocalIdOnly = await prisma.supplierDeliveryRecordStore.updateManyAndReturn({
     *   select: { localId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SupplierDeliveryRecordStoreUpdateManyAndReturnArgs>(args: SelectSubset<T, SupplierDeliveryRecordStoreUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierDeliveryRecordStorePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SupplierDeliveryRecordStore.
     * @param {SupplierDeliveryRecordStoreUpsertArgs} args - Arguments to update or create a SupplierDeliveryRecordStore.
     * @example
     * // Update or create a SupplierDeliveryRecordStore
     * const supplierDeliveryRecordStore = await prisma.supplierDeliveryRecordStore.upsert({
     *   create: {
     *     // ... data to create a SupplierDeliveryRecordStore
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SupplierDeliveryRecordStore we want to update
     *   }
     * })
     */
    upsert<T extends SupplierDeliveryRecordStoreUpsertArgs>(args: SelectSubset<T, SupplierDeliveryRecordStoreUpsertArgs<ExtArgs>>): Prisma__SupplierDeliveryRecordStoreClient<$Result.GetResult<Prisma.$SupplierDeliveryRecordStorePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SupplierDeliveryRecordStores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierDeliveryRecordStoreCountArgs} args - Arguments to filter SupplierDeliveryRecordStores to count.
     * @example
     * // Count the number of SupplierDeliveryRecordStores
     * const count = await prisma.supplierDeliveryRecordStore.count({
     *   where: {
     *     // ... the filter for the SupplierDeliveryRecordStores we want to count
     *   }
     * })
    **/
    count<T extends SupplierDeliveryRecordStoreCountArgs>(
      args?: Subset<T, SupplierDeliveryRecordStoreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupplierDeliveryRecordStoreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SupplierDeliveryRecordStore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierDeliveryRecordStoreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SupplierDeliveryRecordStoreAggregateArgs>(args: Subset<T, SupplierDeliveryRecordStoreAggregateArgs>): Prisma.PrismaPromise<GetSupplierDeliveryRecordStoreAggregateType<T>>

    /**
     * Group by SupplierDeliveryRecordStore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierDeliveryRecordStoreGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SupplierDeliveryRecordStoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupplierDeliveryRecordStoreGroupByArgs['orderBy'] }
        : { orderBy?: SupplierDeliveryRecordStoreGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SupplierDeliveryRecordStoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierDeliveryRecordStoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SupplierDeliveryRecordStore model
   */
  readonly fields: SupplierDeliveryRecordStoreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SupplierDeliveryRecordStore.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupplierDeliveryRecordStoreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SupplierDeliveryRecordStore model
   */
  interface SupplierDeliveryRecordStoreFieldRefs {
    readonly localId: FieldRef<"SupplierDeliveryRecordStore", 'String'>
    readonly payload: FieldRef<"SupplierDeliveryRecordStore", 'Json'>
    readonly createdAt: FieldRef<"SupplierDeliveryRecordStore", 'DateTime'>
    readonly updatedAt: FieldRef<"SupplierDeliveryRecordStore", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SupplierDeliveryRecordStore findUnique
   */
  export type SupplierDeliveryRecordStoreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierDeliveryRecordStore
     */
    select?: SupplierDeliveryRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierDeliveryRecordStore
     */
    omit?: SupplierDeliveryRecordStoreOmit<ExtArgs> | null
    /**
     * Filter, which SupplierDeliveryRecordStore to fetch.
     */
    where: SupplierDeliveryRecordStoreWhereUniqueInput
  }

  /**
   * SupplierDeliveryRecordStore findUniqueOrThrow
   */
  export type SupplierDeliveryRecordStoreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierDeliveryRecordStore
     */
    select?: SupplierDeliveryRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierDeliveryRecordStore
     */
    omit?: SupplierDeliveryRecordStoreOmit<ExtArgs> | null
    /**
     * Filter, which SupplierDeliveryRecordStore to fetch.
     */
    where: SupplierDeliveryRecordStoreWhereUniqueInput
  }

  /**
   * SupplierDeliveryRecordStore findFirst
   */
  export type SupplierDeliveryRecordStoreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierDeliveryRecordStore
     */
    select?: SupplierDeliveryRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierDeliveryRecordStore
     */
    omit?: SupplierDeliveryRecordStoreOmit<ExtArgs> | null
    /**
     * Filter, which SupplierDeliveryRecordStore to fetch.
     */
    where?: SupplierDeliveryRecordStoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierDeliveryRecordStores to fetch.
     */
    orderBy?: SupplierDeliveryRecordStoreOrderByWithRelationInput | SupplierDeliveryRecordStoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupplierDeliveryRecordStores.
     */
    cursor?: SupplierDeliveryRecordStoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierDeliveryRecordStores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierDeliveryRecordStores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupplierDeliveryRecordStores.
     */
    distinct?: SupplierDeliveryRecordStoreScalarFieldEnum | SupplierDeliveryRecordStoreScalarFieldEnum[]
  }

  /**
   * SupplierDeliveryRecordStore findFirstOrThrow
   */
  export type SupplierDeliveryRecordStoreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierDeliveryRecordStore
     */
    select?: SupplierDeliveryRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierDeliveryRecordStore
     */
    omit?: SupplierDeliveryRecordStoreOmit<ExtArgs> | null
    /**
     * Filter, which SupplierDeliveryRecordStore to fetch.
     */
    where?: SupplierDeliveryRecordStoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierDeliveryRecordStores to fetch.
     */
    orderBy?: SupplierDeliveryRecordStoreOrderByWithRelationInput | SupplierDeliveryRecordStoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupplierDeliveryRecordStores.
     */
    cursor?: SupplierDeliveryRecordStoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierDeliveryRecordStores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierDeliveryRecordStores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupplierDeliveryRecordStores.
     */
    distinct?: SupplierDeliveryRecordStoreScalarFieldEnum | SupplierDeliveryRecordStoreScalarFieldEnum[]
  }

  /**
   * SupplierDeliveryRecordStore findMany
   */
  export type SupplierDeliveryRecordStoreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierDeliveryRecordStore
     */
    select?: SupplierDeliveryRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierDeliveryRecordStore
     */
    omit?: SupplierDeliveryRecordStoreOmit<ExtArgs> | null
    /**
     * Filter, which SupplierDeliveryRecordStores to fetch.
     */
    where?: SupplierDeliveryRecordStoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierDeliveryRecordStores to fetch.
     */
    orderBy?: SupplierDeliveryRecordStoreOrderByWithRelationInput | SupplierDeliveryRecordStoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SupplierDeliveryRecordStores.
     */
    cursor?: SupplierDeliveryRecordStoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierDeliveryRecordStores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierDeliveryRecordStores.
     */
    skip?: number
    distinct?: SupplierDeliveryRecordStoreScalarFieldEnum | SupplierDeliveryRecordStoreScalarFieldEnum[]
  }

  /**
   * SupplierDeliveryRecordStore create
   */
  export type SupplierDeliveryRecordStoreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierDeliveryRecordStore
     */
    select?: SupplierDeliveryRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierDeliveryRecordStore
     */
    omit?: SupplierDeliveryRecordStoreOmit<ExtArgs> | null
    /**
     * The data needed to create a SupplierDeliveryRecordStore.
     */
    data: XOR<SupplierDeliveryRecordStoreCreateInput, SupplierDeliveryRecordStoreUncheckedCreateInput>
  }

  /**
   * SupplierDeliveryRecordStore createMany
   */
  export type SupplierDeliveryRecordStoreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SupplierDeliveryRecordStores.
     */
    data: SupplierDeliveryRecordStoreCreateManyInput | SupplierDeliveryRecordStoreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SupplierDeliveryRecordStore createManyAndReturn
   */
  export type SupplierDeliveryRecordStoreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierDeliveryRecordStore
     */
    select?: SupplierDeliveryRecordStoreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierDeliveryRecordStore
     */
    omit?: SupplierDeliveryRecordStoreOmit<ExtArgs> | null
    /**
     * The data used to create many SupplierDeliveryRecordStores.
     */
    data: SupplierDeliveryRecordStoreCreateManyInput | SupplierDeliveryRecordStoreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SupplierDeliveryRecordStore update
   */
  export type SupplierDeliveryRecordStoreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierDeliveryRecordStore
     */
    select?: SupplierDeliveryRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierDeliveryRecordStore
     */
    omit?: SupplierDeliveryRecordStoreOmit<ExtArgs> | null
    /**
     * The data needed to update a SupplierDeliveryRecordStore.
     */
    data: XOR<SupplierDeliveryRecordStoreUpdateInput, SupplierDeliveryRecordStoreUncheckedUpdateInput>
    /**
     * Choose, which SupplierDeliveryRecordStore to update.
     */
    where: SupplierDeliveryRecordStoreWhereUniqueInput
  }

  /**
   * SupplierDeliveryRecordStore updateMany
   */
  export type SupplierDeliveryRecordStoreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SupplierDeliveryRecordStores.
     */
    data: XOR<SupplierDeliveryRecordStoreUpdateManyMutationInput, SupplierDeliveryRecordStoreUncheckedUpdateManyInput>
    /**
     * Filter which SupplierDeliveryRecordStores to update
     */
    where?: SupplierDeliveryRecordStoreWhereInput
    /**
     * Limit how many SupplierDeliveryRecordStores to update.
     */
    limit?: number
  }

  /**
   * SupplierDeliveryRecordStore updateManyAndReturn
   */
  export type SupplierDeliveryRecordStoreUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierDeliveryRecordStore
     */
    select?: SupplierDeliveryRecordStoreSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierDeliveryRecordStore
     */
    omit?: SupplierDeliveryRecordStoreOmit<ExtArgs> | null
    /**
     * The data used to update SupplierDeliveryRecordStores.
     */
    data: XOR<SupplierDeliveryRecordStoreUpdateManyMutationInput, SupplierDeliveryRecordStoreUncheckedUpdateManyInput>
    /**
     * Filter which SupplierDeliveryRecordStores to update
     */
    where?: SupplierDeliveryRecordStoreWhereInput
    /**
     * Limit how many SupplierDeliveryRecordStores to update.
     */
    limit?: number
  }

  /**
   * SupplierDeliveryRecordStore upsert
   */
  export type SupplierDeliveryRecordStoreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierDeliveryRecordStore
     */
    select?: SupplierDeliveryRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierDeliveryRecordStore
     */
    omit?: SupplierDeliveryRecordStoreOmit<ExtArgs> | null
    /**
     * The filter to search for the SupplierDeliveryRecordStore to update in case it exists.
     */
    where: SupplierDeliveryRecordStoreWhereUniqueInput
    /**
     * In case the SupplierDeliveryRecordStore found by the `where` argument doesn't exist, create a new SupplierDeliveryRecordStore with this data.
     */
    create: XOR<SupplierDeliveryRecordStoreCreateInput, SupplierDeliveryRecordStoreUncheckedCreateInput>
    /**
     * In case the SupplierDeliveryRecordStore was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupplierDeliveryRecordStoreUpdateInput, SupplierDeliveryRecordStoreUncheckedUpdateInput>
  }

  /**
   * SupplierDeliveryRecordStore delete
   */
  export type SupplierDeliveryRecordStoreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierDeliveryRecordStore
     */
    select?: SupplierDeliveryRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierDeliveryRecordStore
     */
    omit?: SupplierDeliveryRecordStoreOmit<ExtArgs> | null
    /**
     * Filter which SupplierDeliveryRecordStore to delete.
     */
    where: SupplierDeliveryRecordStoreWhereUniqueInput
  }

  /**
   * SupplierDeliveryRecordStore deleteMany
   */
  export type SupplierDeliveryRecordStoreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupplierDeliveryRecordStores to delete
     */
    where?: SupplierDeliveryRecordStoreWhereInput
    /**
     * Limit how many SupplierDeliveryRecordStores to delete.
     */
    limit?: number
  }

  /**
   * SupplierDeliveryRecordStore without action
   */
  export type SupplierDeliveryRecordStoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierDeliveryRecordStore
     */
    select?: SupplierDeliveryRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierDeliveryRecordStore
     */
    omit?: SupplierDeliveryRecordStoreOmit<ExtArgs> | null
  }


  /**
   * Model SupplierGrnRecordStore
   */

  export type AggregateSupplierGrnRecordStore = {
    _count: SupplierGrnRecordStoreCountAggregateOutputType | null
    _min: SupplierGrnRecordStoreMinAggregateOutputType | null
    _max: SupplierGrnRecordStoreMaxAggregateOutputType | null
  }

  export type SupplierGrnRecordStoreMinAggregateOutputType = {
    localId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierGrnRecordStoreMaxAggregateOutputType = {
    localId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SupplierGrnRecordStoreCountAggregateOutputType = {
    localId: number
    payload: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SupplierGrnRecordStoreMinAggregateInputType = {
    localId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierGrnRecordStoreMaxAggregateInputType = {
    localId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SupplierGrnRecordStoreCountAggregateInputType = {
    localId?: true
    payload?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SupplierGrnRecordStoreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupplierGrnRecordStore to aggregate.
     */
    where?: SupplierGrnRecordStoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierGrnRecordStores to fetch.
     */
    orderBy?: SupplierGrnRecordStoreOrderByWithRelationInput | SupplierGrnRecordStoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupplierGrnRecordStoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierGrnRecordStores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierGrnRecordStores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SupplierGrnRecordStores
    **/
    _count?: true | SupplierGrnRecordStoreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupplierGrnRecordStoreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupplierGrnRecordStoreMaxAggregateInputType
  }

  export type GetSupplierGrnRecordStoreAggregateType<T extends SupplierGrnRecordStoreAggregateArgs> = {
        [P in keyof T & keyof AggregateSupplierGrnRecordStore]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupplierGrnRecordStore[P]>
      : GetScalarType<T[P], AggregateSupplierGrnRecordStore[P]>
  }




  export type SupplierGrnRecordStoreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupplierGrnRecordStoreWhereInput
    orderBy?: SupplierGrnRecordStoreOrderByWithAggregationInput | SupplierGrnRecordStoreOrderByWithAggregationInput[]
    by: SupplierGrnRecordStoreScalarFieldEnum[] | SupplierGrnRecordStoreScalarFieldEnum
    having?: SupplierGrnRecordStoreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupplierGrnRecordStoreCountAggregateInputType | true
    _min?: SupplierGrnRecordStoreMinAggregateInputType
    _max?: SupplierGrnRecordStoreMaxAggregateInputType
  }

  export type SupplierGrnRecordStoreGroupByOutputType = {
    localId: string
    payload: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: SupplierGrnRecordStoreCountAggregateOutputType | null
    _min: SupplierGrnRecordStoreMinAggregateOutputType | null
    _max: SupplierGrnRecordStoreMaxAggregateOutputType | null
  }

  type GetSupplierGrnRecordStoreGroupByPayload<T extends SupplierGrnRecordStoreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupplierGrnRecordStoreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupplierGrnRecordStoreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupplierGrnRecordStoreGroupByOutputType[P]>
            : GetScalarType<T[P], SupplierGrnRecordStoreGroupByOutputType[P]>
        }
      >
    >


  export type SupplierGrnRecordStoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplierGrnRecordStore"]>

  export type SupplierGrnRecordStoreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplierGrnRecordStore"]>

  export type SupplierGrnRecordStoreSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["supplierGrnRecordStore"]>

  export type SupplierGrnRecordStoreSelectScalar = {
    localId?: boolean
    payload?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SupplierGrnRecordStoreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"localId" | "payload" | "createdAt" | "updatedAt", ExtArgs["result"]["supplierGrnRecordStore"]>

  export type $SupplierGrnRecordStorePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SupplierGrnRecordStore"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      localId: string
      payload: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["supplierGrnRecordStore"]>
    composites: {}
  }

  type SupplierGrnRecordStoreGetPayload<S extends boolean | null | undefined | SupplierGrnRecordStoreDefaultArgs> = $Result.GetResult<Prisma.$SupplierGrnRecordStorePayload, S>

  type SupplierGrnRecordStoreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SupplierGrnRecordStoreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SupplierGrnRecordStoreCountAggregateInputType | true
    }

  export interface SupplierGrnRecordStoreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SupplierGrnRecordStore'], meta: { name: 'SupplierGrnRecordStore' } }
    /**
     * Find zero or one SupplierGrnRecordStore that matches the filter.
     * @param {SupplierGrnRecordStoreFindUniqueArgs} args - Arguments to find a SupplierGrnRecordStore
     * @example
     * // Get one SupplierGrnRecordStore
     * const supplierGrnRecordStore = await prisma.supplierGrnRecordStore.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupplierGrnRecordStoreFindUniqueArgs>(args: SelectSubset<T, SupplierGrnRecordStoreFindUniqueArgs<ExtArgs>>): Prisma__SupplierGrnRecordStoreClient<$Result.GetResult<Prisma.$SupplierGrnRecordStorePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SupplierGrnRecordStore that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SupplierGrnRecordStoreFindUniqueOrThrowArgs} args - Arguments to find a SupplierGrnRecordStore
     * @example
     * // Get one SupplierGrnRecordStore
     * const supplierGrnRecordStore = await prisma.supplierGrnRecordStore.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupplierGrnRecordStoreFindUniqueOrThrowArgs>(args: SelectSubset<T, SupplierGrnRecordStoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupplierGrnRecordStoreClient<$Result.GetResult<Prisma.$SupplierGrnRecordStorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SupplierGrnRecordStore that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierGrnRecordStoreFindFirstArgs} args - Arguments to find a SupplierGrnRecordStore
     * @example
     * // Get one SupplierGrnRecordStore
     * const supplierGrnRecordStore = await prisma.supplierGrnRecordStore.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupplierGrnRecordStoreFindFirstArgs>(args?: SelectSubset<T, SupplierGrnRecordStoreFindFirstArgs<ExtArgs>>): Prisma__SupplierGrnRecordStoreClient<$Result.GetResult<Prisma.$SupplierGrnRecordStorePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SupplierGrnRecordStore that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierGrnRecordStoreFindFirstOrThrowArgs} args - Arguments to find a SupplierGrnRecordStore
     * @example
     * // Get one SupplierGrnRecordStore
     * const supplierGrnRecordStore = await prisma.supplierGrnRecordStore.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupplierGrnRecordStoreFindFirstOrThrowArgs>(args?: SelectSubset<T, SupplierGrnRecordStoreFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupplierGrnRecordStoreClient<$Result.GetResult<Prisma.$SupplierGrnRecordStorePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SupplierGrnRecordStores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierGrnRecordStoreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SupplierGrnRecordStores
     * const supplierGrnRecordStores = await prisma.supplierGrnRecordStore.findMany()
     * 
     * // Get first 10 SupplierGrnRecordStores
     * const supplierGrnRecordStores = await prisma.supplierGrnRecordStore.findMany({ take: 10 })
     * 
     * // Only select the `localId`
     * const supplierGrnRecordStoreWithLocalIdOnly = await prisma.supplierGrnRecordStore.findMany({ select: { localId: true } })
     * 
     */
    findMany<T extends SupplierGrnRecordStoreFindManyArgs>(args?: SelectSubset<T, SupplierGrnRecordStoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierGrnRecordStorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SupplierGrnRecordStore.
     * @param {SupplierGrnRecordStoreCreateArgs} args - Arguments to create a SupplierGrnRecordStore.
     * @example
     * // Create one SupplierGrnRecordStore
     * const SupplierGrnRecordStore = await prisma.supplierGrnRecordStore.create({
     *   data: {
     *     // ... data to create a SupplierGrnRecordStore
     *   }
     * })
     * 
     */
    create<T extends SupplierGrnRecordStoreCreateArgs>(args: SelectSubset<T, SupplierGrnRecordStoreCreateArgs<ExtArgs>>): Prisma__SupplierGrnRecordStoreClient<$Result.GetResult<Prisma.$SupplierGrnRecordStorePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SupplierGrnRecordStores.
     * @param {SupplierGrnRecordStoreCreateManyArgs} args - Arguments to create many SupplierGrnRecordStores.
     * @example
     * // Create many SupplierGrnRecordStores
     * const supplierGrnRecordStore = await prisma.supplierGrnRecordStore.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupplierGrnRecordStoreCreateManyArgs>(args?: SelectSubset<T, SupplierGrnRecordStoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SupplierGrnRecordStores and returns the data saved in the database.
     * @param {SupplierGrnRecordStoreCreateManyAndReturnArgs} args - Arguments to create many SupplierGrnRecordStores.
     * @example
     * // Create many SupplierGrnRecordStores
     * const supplierGrnRecordStore = await prisma.supplierGrnRecordStore.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SupplierGrnRecordStores and only return the `localId`
     * const supplierGrnRecordStoreWithLocalIdOnly = await prisma.supplierGrnRecordStore.createManyAndReturn({
     *   select: { localId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SupplierGrnRecordStoreCreateManyAndReturnArgs>(args?: SelectSubset<T, SupplierGrnRecordStoreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierGrnRecordStorePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SupplierGrnRecordStore.
     * @param {SupplierGrnRecordStoreDeleteArgs} args - Arguments to delete one SupplierGrnRecordStore.
     * @example
     * // Delete one SupplierGrnRecordStore
     * const SupplierGrnRecordStore = await prisma.supplierGrnRecordStore.delete({
     *   where: {
     *     // ... filter to delete one SupplierGrnRecordStore
     *   }
     * })
     * 
     */
    delete<T extends SupplierGrnRecordStoreDeleteArgs>(args: SelectSubset<T, SupplierGrnRecordStoreDeleteArgs<ExtArgs>>): Prisma__SupplierGrnRecordStoreClient<$Result.GetResult<Prisma.$SupplierGrnRecordStorePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SupplierGrnRecordStore.
     * @param {SupplierGrnRecordStoreUpdateArgs} args - Arguments to update one SupplierGrnRecordStore.
     * @example
     * // Update one SupplierGrnRecordStore
     * const supplierGrnRecordStore = await prisma.supplierGrnRecordStore.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupplierGrnRecordStoreUpdateArgs>(args: SelectSubset<T, SupplierGrnRecordStoreUpdateArgs<ExtArgs>>): Prisma__SupplierGrnRecordStoreClient<$Result.GetResult<Prisma.$SupplierGrnRecordStorePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SupplierGrnRecordStores.
     * @param {SupplierGrnRecordStoreDeleteManyArgs} args - Arguments to filter SupplierGrnRecordStores to delete.
     * @example
     * // Delete a few SupplierGrnRecordStores
     * const { count } = await prisma.supplierGrnRecordStore.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupplierGrnRecordStoreDeleteManyArgs>(args?: SelectSubset<T, SupplierGrnRecordStoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SupplierGrnRecordStores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierGrnRecordStoreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SupplierGrnRecordStores
     * const supplierGrnRecordStore = await prisma.supplierGrnRecordStore.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupplierGrnRecordStoreUpdateManyArgs>(args: SelectSubset<T, SupplierGrnRecordStoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SupplierGrnRecordStores and returns the data updated in the database.
     * @param {SupplierGrnRecordStoreUpdateManyAndReturnArgs} args - Arguments to update many SupplierGrnRecordStores.
     * @example
     * // Update many SupplierGrnRecordStores
     * const supplierGrnRecordStore = await prisma.supplierGrnRecordStore.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SupplierGrnRecordStores and only return the `localId`
     * const supplierGrnRecordStoreWithLocalIdOnly = await prisma.supplierGrnRecordStore.updateManyAndReturn({
     *   select: { localId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SupplierGrnRecordStoreUpdateManyAndReturnArgs>(args: SelectSubset<T, SupplierGrnRecordStoreUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierGrnRecordStorePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SupplierGrnRecordStore.
     * @param {SupplierGrnRecordStoreUpsertArgs} args - Arguments to update or create a SupplierGrnRecordStore.
     * @example
     * // Update or create a SupplierGrnRecordStore
     * const supplierGrnRecordStore = await prisma.supplierGrnRecordStore.upsert({
     *   create: {
     *     // ... data to create a SupplierGrnRecordStore
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SupplierGrnRecordStore we want to update
     *   }
     * })
     */
    upsert<T extends SupplierGrnRecordStoreUpsertArgs>(args: SelectSubset<T, SupplierGrnRecordStoreUpsertArgs<ExtArgs>>): Prisma__SupplierGrnRecordStoreClient<$Result.GetResult<Prisma.$SupplierGrnRecordStorePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SupplierGrnRecordStores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierGrnRecordStoreCountArgs} args - Arguments to filter SupplierGrnRecordStores to count.
     * @example
     * // Count the number of SupplierGrnRecordStores
     * const count = await prisma.supplierGrnRecordStore.count({
     *   where: {
     *     // ... the filter for the SupplierGrnRecordStores we want to count
     *   }
     * })
    **/
    count<T extends SupplierGrnRecordStoreCountArgs>(
      args?: Subset<T, SupplierGrnRecordStoreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupplierGrnRecordStoreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SupplierGrnRecordStore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierGrnRecordStoreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SupplierGrnRecordStoreAggregateArgs>(args: Subset<T, SupplierGrnRecordStoreAggregateArgs>): Prisma.PrismaPromise<GetSupplierGrnRecordStoreAggregateType<T>>

    /**
     * Group by SupplierGrnRecordStore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierGrnRecordStoreGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SupplierGrnRecordStoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupplierGrnRecordStoreGroupByArgs['orderBy'] }
        : { orderBy?: SupplierGrnRecordStoreGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SupplierGrnRecordStoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierGrnRecordStoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SupplierGrnRecordStore model
   */
  readonly fields: SupplierGrnRecordStoreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SupplierGrnRecordStore.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupplierGrnRecordStoreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SupplierGrnRecordStore model
   */
  interface SupplierGrnRecordStoreFieldRefs {
    readonly localId: FieldRef<"SupplierGrnRecordStore", 'String'>
    readonly payload: FieldRef<"SupplierGrnRecordStore", 'Json'>
    readonly createdAt: FieldRef<"SupplierGrnRecordStore", 'DateTime'>
    readonly updatedAt: FieldRef<"SupplierGrnRecordStore", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SupplierGrnRecordStore findUnique
   */
  export type SupplierGrnRecordStoreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierGrnRecordStore
     */
    select?: SupplierGrnRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierGrnRecordStore
     */
    omit?: SupplierGrnRecordStoreOmit<ExtArgs> | null
    /**
     * Filter, which SupplierGrnRecordStore to fetch.
     */
    where: SupplierGrnRecordStoreWhereUniqueInput
  }

  /**
   * SupplierGrnRecordStore findUniqueOrThrow
   */
  export type SupplierGrnRecordStoreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierGrnRecordStore
     */
    select?: SupplierGrnRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierGrnRecordStore
     */
    omit?: SupplierGrnRecordStoreOmit<ExtArgs> | null
    /**
     * Filter, which SupplierGrnRecordStore to fetch.
     */
    where: SupplierGrnRecordStoreWhereUniqueInput
  }

  /**
   * SupplierGrnRecordStore findFirst
   */
  export type SupplierGrnRecordStoreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierGrnRecordStore
     */
    select?: SupplierGrnRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierGrnRecordStore
     */
    omit?: SupplierGrnRecordStoreOmit<ExtArgs> | null
    /**
     * Filter, which SupplierGrnRecordStore to fetch.
     */
    where?: SupplierGrnRecordStoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierGrnRecordStores to fetch.
     */
    orderBy?: SupplierGrnRecordStoreOrderByWithRelationInput | SupplierGrnRecordStoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupplierGrnRecordStores.
     */
    cursor?: SupplierGrnRecordStoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierGrnRecordStores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierGrnRecordStores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupplierGrnRecordStores.
     */
    distinct?: SupplierGrnRecordStoreScalarFieldEnum | SupplierGrnRecordStoreScalarFieldEnum[]
  }

  /**
   * SupplierGrnRecordStore findFirstOrThrow
   */
  export type SupplierGrnRecordStoreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierGrnRecordStore
     */
    select?: SupplierGrnRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierGrnRecordStore
     */
    omit?: SupplierGrnRecordStoreOmit<ExtArgs> | null
    /**
     * Filter, which SupplierGrnRecordStore to fetch.
     */
    where?: SupplierGrnRecordStoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierGrnRecordStores to fetch.
     */
    orderBy?: SupplierGrnRecordStoreOrderByWithRelationInput | SupplierGrnRecordStoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SupplierGrnRecordStores.
     */
    cursor?: SupplierGrnRecordStoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierGrnRecordStores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierGrnRecordStores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SupplierGrnRecordStores.
     */
    distinct?: SupplierGrnRecordStoreScalarFieldEnum | SupplierGrnRecordStoreScalarFieldEnum[]
  }

  /**
   * SupplierGrnRecordStore findMany
   */
  export type SupplierGrnRecordStoreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierGrnRecordStore
     */
    select?: SupplierGrnRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierGrnRecordStore
     */
    omit?: SupplierGrnRecordStoreOmit<ExtArgs> | null
    /**
     * Filter, which SupplierGrnRecordStores to fetch.
     */
    where?: SupplierGrnRecordStoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SupplierGrnRecordStores to fetch.
     */
    orderBy?: SupplierGrnRecordStoreOrderByWithRelationInput | SupplierGrnRecordStoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SupplierGrnRecordStores.
     */
    cursor?: SupplierGrnRecordStoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SupplierGrnRecordStores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SupplierGrnRecordStores.
     */
    skip?: number
    distinct?: SupplierGrnRecordStoreScalarFieldEnum | SupplierGrnRecordStoreScalarFieldEnum[]
  }

  /**
   * SupplierGrnRecordStore create
   */
  export type SupplierGrnRecordStoreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierGrnRecordStore
     */
    select?: SupplierGrnRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierGrnRecordStore
     */
    omit?: SupplierGrnRecordStoreOmit<ExtArgs> | null
    /**
     * The data needed to create a SupplierGrnRecordStore.
     */
    data: XOR<SupplierGrnRecordStoreCreateInput, SupplierGrnRecordStoreUncheckedCreateInput>
  }

  /**
   * SupplierGrnRecordStore createMany
   */
  export type SupplierGrnRecordStoreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SupplierGrnRecordStores.
     */
    data: SupplierGrnRecordStoreCreateManyInput | SupplierGrnRecordStoreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SupplierGrnRecordStore createManyAndReturn
   */
  export type SupplierGrnRecordStoreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierGrnRecordStore
     */
    select?: SupplierGrnRecordStoreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierGrnRecordStore
     */
    omit?: SupplierGrnRecordStoreOmit<ExtArgs> | null
    /**
     * The data used to create many SupplierGrnRecordStores.
     */
    data: SupplierGrnRecordStoreCreateManyInput | SupplierGrnRecordStoreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SupplierGrnRecordStore update
   */
  export type SupplierGrnRecordStoreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierGrnRecordStore
     */
    select?: SupplierGrnRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierGrnRecordStore
     */
    omit?: SupplierGrnRecordStoreOmit<ExtArgs> | null
    /**
     * The data needed to update a SupplierGrnRecordStore.
     */
    data: XOR<SupplierGrnRecordStoreUpdateInput, SupplierGrnRecordStoreUncheckedUpdateInput>
    /**
     * Choose, which SupplierGrnRecordStore to update.
     */
    where: SupplierGrnRecordStoreWhereUniqueInput
  }

  /**
   * SupplierGrnRecordStore updateMany
   */
  export type SupplierGrnRecordStoreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SupplierGrnRecordStores.
     */
    data: XOR<SupplierGrnRecordStoreUpdateManyMutationInput, SupplierGrnRecordStoreUncheckedUpdateManyInput>
    /**
     * Filter which SupplierGrnRecordStores to update
     */
    where?: SupplierGrnRecordStoreWhereInput
    /**
     * Limit how many SupplierGrnRecordStores to update.
     */
    limit?: number
  }

  /**
   * SupplierGrnRecordStore updateManyAndReturn
   */
  export type SupplierGrnRecordStoreUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierGrnRecordStore
     */
    select?: SupplierGrnRecordStoreSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierGrnRecordStore
     */
    omit?: SupplierGrnRecordStoreOmit<ExtArgs> | null
    /**
     * The data used to update SupplierGrnRecordStores.
     */
    data: XOR<SupplierGrnRecordStoreUpdateManyMutationInput, SupplierGrnRecordStoreUncheckedUpdateManyInput>
    /**
     * Filter which SupplierGrnRecordStores to update
     */
    where?: SupplierGrnRecordStoreWhereInput
    /**
     * Limit how many SupplierGrnRecordStores to update.
     */
    limit?: number
  }

  /**
   * SupplierGrnRecordStore upsert
   */
  export type SupplierGrnRecordStoreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierGrnRecordStore
     */
    select?: SupplierGrnRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierGrnRecordStore
     */
    omit?: SupplierGrnRecordStoreOmit<ExtArgs> | null
    /**
     * The filter to search for the SupplierGrnRecordStore to update in case it exists.
     */
    where: SupplierGrnRecordStoreWhereUniqueInput
    /**
     * In case the SupplierGrnRecordStore found by the `where` argument doesn't exist, create a new SupplierGrnRecordStore with this data.
     */
    create: XOR<SupplierGrnRecordStoreCreateInput, SupplierGrnRecordStoreUncheckedCreateInput>
    /**
     * In case the SupplierGrnRecordStore was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupplierGrnRecordStoreUpdateInput, SupplierGrnRecordStoreUncheckedUpdateInput>
  }

  /**
   * SupplierGrnRecordStore delete
   */
  export type SupplierGrnRecordStoreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierGrnRecordStore
     */
    select?: SupplierGrnRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierGrnRecordStore
     */
    omit?: SupplierGrnRecordStoreOmit<ExtArgs> | null
    /**
     * Filter which SupplierGrnRecordStore to delete.
     */
    where: SupplierGrnRecordStoreWhereUniqueInput
  }

  /**
   * SupplierGrnRecordStore deleteMany
   */
  export type SupplierGrnRecordStoreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SupplierGrnRecordStores to delete
     */
    where?: SupplierGrnRecordStoreWhereInput
    /**
     * Limit how many SupplierGrnRecordStores to delete.
     */
    limit?: number
  }

  /**
   * SupplierGrnRecordStore without action
   */
  export type SupplierGrnRecordStoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierGrnRecordStore
     */
    select?: SupplierGrnRecordStoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SupplierGrnRecordStore
     */
    omit?: SupplierGrnRecordStoreOmit<ExtArgs> | null
  }


  /**
   * Model ChatSession
   */

  export type AggregateChatSession = {
    _count: ChatSessionCountAggregateOutputType | null
    _avg: ChatSessionAvgAggregateOutputType | null
    _sum: ChatSessionSumAggregateOutputType | null
    _min: ChatSessionMinAggregateOutputType | null
    _max: ChatSessionMaxAggregateOutputType | null
  }

  export type ChatSessionAvgAggregateOutputType = {
    userId: number | null
  }

  export type ChatSessionSumAggregateOutputType = {
    userId: number | null
  }

  export type ChatSessionMinAggregateOutputType = {
    id: string | null
    userId: number | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChatSessionMaxAggregateOutputType = {
    id: string | null
    userId: number | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChatSessionCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChatSessionAvgAggregateInputType = {
    userId?: true
  }

  export type ChatSessionSumAggregateInputType = {
    userId?: true
  }

  export type ChatSessionMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChatSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChatSessionCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChatSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatSession to aggregate.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatSessions
    **/
    _count?: true | ChatSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChatSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChatSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatSessionMaxAggregateInputType
  }

  export type GetChatSessionAggregateType<T extends ChatSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateChatSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatSession[P]>
      : GetScalarType<T[P], AggregateChatSession[P]>
  }




  export type ChatSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
    orderBy?: ChatSessionOrderByWithAggregationInput | ChatSessionOrderByWithAggregationInput[]
    by: ChatSessionScalarFieldEnum[] | ChatSessionScalarFieldEnum
    having?: ChatSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatSessionCountAggregateInputType | true
    _avg?: ChatSessionAvgAggregateInputType
    _sum?: ChatSessionSumAggregateInputType
    _min?: ChatSessionMinAggregateInputType
    _max?: ChatSessionMaxAggregateInputType
  }

  export type ChatSessionGroupByOutputType = {
    id: string
    userId: number
    title: string | null
    createdAt: Date
    updatedAt: Date
    _count: ChatSessionCountAggregateOutputType | null
    _avg: ChatSessionAvgAggregateOutputType | null
    _sum: ChatSessionSumAggregateOutputType | null
    _min: ChatSessionMinAggregateOutputType | null
    _max: ChatSessionMaxAggregateOutputType | null
  }

  type GetChatSessionGroupByPayload<T extends ChatSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatSessionGroupByOutputType[P]>
            : GetScalarType<T[P], ChatSessionGroupByOutputType[P]>
        }
      >
    >


  export type ChatSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    messages?: boolean | ChatSession$messagesArgs<ExtArgs>
    sources?: boolean | ChatSession$sourcesArgs<ExtArgs>
    _count?: boolean | ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>

  export type ChatSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChatSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "createdAt" | "updatedAt", ExtArgs["result"]["chatSession"]>
  export type ChatSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    messages?: boolean | ChatSession$messagesArgs<ExtArgs>
    sources?: boolean | ChatSession$sourcesArgs<ExtArgs>
    _count?: boolean | ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChatSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ChatSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ChatSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      messages: Prisma.$ChatMessagePayload<ExtArgs>[]
      sources: Prisma.$SourcePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: number
      title: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["chatSession"]>
    composites: {}
  }

  type ChatSessionGetPayload<S extends boolean | null | undefined | ChatSessionDefaultArgs> = $Result.GetResult<Prisma.$ChatSessionPayload, S>

  type ChatSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatSessionCountAggregateInputType | true
    }

  export interface ChatSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatSession'], meta: { name: 'ChatSession' } }
    /**
     * Find zero or one ChatSession that matches the filter.
     * @param {ChatSessionFindUniqueArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatSessionFindUniqueArgs>(args: SelectSubset<T, ChatSessionFindUniqueArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatSessionFindUniqueOrThrowArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindFirstArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatSessionFindFirstArgs>(args?: SelectSubset<T, ChatSessionFindFirstArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindFirstOrThrowArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatSessions
     * const chatSessions = await prisma.chatSession.findMany()
     * 
     * // Get first 10 ChatSessions
     * const chatSessions = await prisma.chatSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatSessionFindManyArgs>(args?: SelectSubset<T, ChatSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatSession.
     * @param {ChatSessionCreateArgs} args - Arguments to create a ChatSession.
     * @example
     * // Create one ChatSession
     * const ChatSession = await prisma.chatSession.create({
     *   data: {
     *     // ... data to create a ChatSession
     *   }
     * })
     * 
     */
    create<T extends ChatSessionCreateArgs>(args: SelectSubset<T, ChatSessionCreateArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatSessions.
     * @param {ChatSessionCreateManyArgs} args - Arguments to create many ChatSessions.
     * @example
     * // Create many ChatSessions
     * const chatSession = await prisma.chatSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatSessionCreateManyArgs>(args?: SelectSubset<T, ChatSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatSessions and returns the data saved in the database.
     * @param {ChatSessionCreateManyAndReturnArgs} args - Arguments to create many ChatSessions.
     * @example
     * // Create many ChatSessions
     * const chatSession = await prisma.chatSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatSessions and only return the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatSession.
     * @param {ChatSessionDeleteArgs} args - Arguments to delete one ChatSession.
     * @example
     * // Delete one ChatSession
     * const ChatSession = await prisma.chatSession.delete({
     *   where: {
     *     // ... filter to delete one ChatSession
     *   }
     * })
     * 
     */
    delete<T extends ChatSessionDeleteArgs>(args: SelectSubset<T, ChatSessionDeleteArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatSession.
     * @param {ChatSessionUpdateArgs} args - Arguments to update one ChatSession.
     * @example
     * // Update one ChatSession
     * const chatSession = await prisma.chatSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatSessionUpdateArgs>(args: SelectSubset<T, ChatSessionUpdateArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatSessions.
     * @param {ChatSessionDeleteManyArgs} args - Arguments to filter ChatSessions to delete.
     * @example
     * // Delete a few ChatSessions
     * const { count } = await prisma.chatSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatSessionDeleteManyArgs>(args?: SelectSubset<T, ChatSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatSessions
     * const chatSession = await prisma.chatSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatSessionUpdateManyArgs>(args: SelectSubset<T, ChatSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatSessions and returns the data updated in the database.
     * @param {ChatSessionUpdateManyAndReturnArgs} args - Arguments to update many ChatSessions.
     * @example
     * // Update many ChatSessions
     * const chatSession = await prisma.chatSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatSessions and only return the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatSession.
     * @param {ChatSessionUpsertArgs} args - Arguments to update or create a ChatSession.
     * @example
     * // Update or create a ChatSession
     * const chatSession = await prisma.chatSession.upsert({
     *   create: {
     *     // ... data to create a ChatSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatSession we want to update
     *   }
     * })
     */
    upsert<T extends ChatSessionUpsertArgs>(args: SelectSubset<T, ChatSessionUpsertArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionCountArgs} args - Arguments to filter ChatSessions to count.
     * @example
     * // Count the number of ChatSessions
     * const count = await prisma.chatSession.count({
     *   where: {
     *     // ... the filter for the ChatSessions we want to count
     *   }
     * })
    **/
    count<T extends ChatSessionCountArgs>(
      args?: Subset<T, ChatSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatSessionAggregateArgs>(args: Subset<T, ChatSessionAggregateArgs>): Prisma.PrismaPromise<GetChatSessionAggregateType<T>>

    /**
     * Group by ChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatSessionGroupByArgs['orderBy'] }
        : { orderBy?: ChatSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatSession model
   */
  readonly fields: ChatSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    messages<T extends ChatSession$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ChatSession$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sources<T extends ChatSession$sourcesArgs<ExtArgs> = {}>(args?: Subset<T, ChatSession$sourcesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatSession model
   */
  interface ChatSessionFieldRefs {
    readonly id: FieldRef<"ChatSession", 'String'>
    readonly userId: FieldRef<"ChatSession", 'Int'>
    readonly title: FieldRef<"ChatSession", 'String'>
    readonly createdAt: FieldRef<"ChatSession", 'DateTime'>
    readonly updatedAt: FieldRef<"ChatSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatSession findUnique
   */
  export type ChatSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession findUniqueOrThrow
   */
  export type ChatSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession findFirst
   */
  export type ChatSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatSessions.
     */
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession findFirstOrThrow
   */
  export type ChatSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatSessions.
     */
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession findMany
   */
  export type ChatSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSessions to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession create
   */
  export type ChatSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatSession.
     */
    data: XOR<ChatSessionCreateInput, ChatSessionUncheckedCreateInput>
  }

  /**
   * ChatSession createMany
   */
  export type ChatSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatSessions.
     */
    data: ChatSessionCreateManyInput | ChatSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatSession createManyAndReturn
   */
  export type ChatSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * The data used to create many ChatSessions.
     */
    data: ChatSessionCreateManyInput | ChatSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatSession update
   */
  export type ChatSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatSession.
     */
    data: XOR<ChatSessionUpdateInput, ChatSessionUncheckedUpdateInput>
    /**
     * Choose, which ChatSession to update.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession updateMany
   */
  export type ChatSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatSessions.
     */
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyInput>
    /**
     * Filter which ChatSessions to update
     */
    where?: ChatSessionWhereInput
    /**
     * Limit how many ChatSessions to update.
     */
    limit?: number
  }

  /**
   * ChatSession updateManyAndReturn
   */
  export type ChatSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * The data used to update ChatSessions.
     */
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyInput>
    /**
     * Filter which ChatSessions to update
     */
    where?: ChatSessionWhereInput
    /**
     * Limit how many ChatSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatSession upsert
   */
  export type ChatSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatSession to update in case it exists.
     */
    where: ChatSessionWhereUniqueInput
    /**
     * In case the ChatSession found by the `where` argument doesn't exist, create a new ChatSession with this data.
     */
    create: XOR<ChatSessionCreateInput, ChatSessionUncheckedCreateInput>
    /**
     * In case the ChatSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatSessionUpdateInput, ChatSessionUncheckedUpdateInput>
  }

  /**
   * ChatSession delete
   */
  export type ChatSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter which ChatSession to delete.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession deleteMany
   */
  export type ChatSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatSessions to delete
     */
    where?: ChatSessionWhereInput
    /**
     * Limit how many ChatSessions to delete.
     */
    limit?: number
  }

  /**
   * ChatSession.messages
   */
  export type ChatSession$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    cursor?: ChatMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatSession.sources
   */
  export type ChatSession$sourcesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    where?: SourceWhereInput
    orderBy?: SourceOrderByWithRelationInput | SourceOrderByWithRelationInput[]
    cursor?: SourceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SourceScalarFieldEnum | SourceScalarFieldEnum[]
  }

  /**
   * ChatSession without action
   */
  export type ChatSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
  }


  /**
   * Model ChatMessage
   */

  export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null
    _avg: ChatMessageAvgAggregateOutputType | null
    _sum: ChatMessageSumAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  export type ChatMessageAvgAggregateOutputType = {
    id: number | null
  }

  export type ChatMessageSumAggregateOutputType = {
    id: number | null
  }

  export type ChatMessageMinAggregateOutputType = {
    id: number | null
    sessionId: string | null
    role: string | null
    content: string | null
    createdAt: Date | null
  }

  export type ChatMessageMaxAggregateOutputType = {
    id: number | null
    sessionId: string | null
    role: string | null
    content: string | null
    createdAt: Date | null
  }

  export type ChatMessageCountAggregateOutputType = {
    id: number
    sessionId: number
    role: number
    content: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type ChatMessageAvgAggregateInputType = {
    id?: true
  }

  export type ChatMessageSumAggregateInputType = {
    id?: true
  }

  export type ChatMessageMinAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    createdAt?: true
  }

  export type ChatMessageMaxAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    createdAt?: true
  }

  export type ChatMessageCountAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type ChatMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessage to aggregate.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMessages
    **/
    _count?: true | ChatMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChatMessageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChatMessageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageMaxAggregateInputType
  }

  export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessage[P]>
      : GetScalarType<T[P], AggregateChatMessage[P]>
  }




  export type ChatMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithAggregationInput | ChatMessageOrderByWithAggregationInput[]
    by: ChatMessageScalarFieldEnum[] | ChatMessageScalarFieldEnum
    having?: ChatMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessageCountAggregateInputType | true
    _avg?: ChatMessageAvgAggregateInputType
    _sum?: ChatMessageSumAggregateInputType
    _min?: ChatMessageMinAggregateInputType
    _max?: ChatMessageMaxAggregateInputType
  }

  export type ChatMessageGroupByOutputType = {
    id: number
    sessionId: string
    role: string
    content: string
    metadata: JsonValue | null
    createdAt: Date
    _count: ChatMessageCountAggregateOutputType | null
    _avg: ChatMessageAvgAggregateOutputType | null
    _sum: ChatMessageSumAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
        }
      >
    >


  export type ChatMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    metadata?: boolean
    createdAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    metadata?: boolean
    createdAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    metadata?: boolean
    createdAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectScalar = {
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type ChatMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "role" | "content" | "metadata" | "createdAt", ExtArgs["result"]["chatMessage"]>
  export type ChatMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }

  export type $ChatMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatMessage"
    objects: {
      session: Prisma.$ChatSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      sessionId: string
      role: string
      content: string
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["chatMessage"]>
    composites: {}
  }

  type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = $Result.GetResult<Prisma.$ChatMessagePayload, S>

  type ChatMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatMessageCountAggregateInputType | true
    }

  export interface ChatMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'], meta: { name: 'ChatMessage' } }
    /**
     * Find zero or one ChatMessage that matches the filter.
     * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatMessageFindUniqueArgs>(args: SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatMessageFindFirstArgs>(args?: SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany()
     * 
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatMessageFindManyArgs>(args?: SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatMessage.
     * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
     * @example
     * // Create one ChatMessage
     * const ChatMessage = await prisma.chatMessage.create({
     *   data: {
     *     // ... data to create a ChatMessage
     *   }
     * })
     * 
     */
    create<T extends ChatMessageCreateArgs>(args: SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatMessages.
     * @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatMessageCreateManyArgs>(args?: SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatMessages and returns the data saved in the database.
     * @param {ChatMessageCreateManyAndReturnArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatMessage.
     * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
     * @example
     * // Delete one ChatMessage
     * const ChatMessage = await prisma.chatMessage.delete({
     *   where: {
     *     // ... filter to delete one ChatMessage
     *   }
     * })
     * 
     */
    delete<T extends ChatMessageDeleteArgs>(args: SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatMessage.
     * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
     * @example
     * // Update one ChatMessage
     * const chatMessage = await prisma.chatMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatMessageUpdateArgs>(args: SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatMessages.
     * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatMessageUpdateManyArgs>(args: SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages and returns the data updated in the database.
     * @param {ChatMessageUpdateManyAndReturnArgs} args - Arguments to update many ChatMessages.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatMessage.
     * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
     * @example
     * // Update or create a ChatMessage
     * const chatMessage = await prisma.chatMessage.upsert({
     *   create: {
     *     // ... data to create a ChatMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessage we want to update
     *   }
     * })
     */
    upsert<T extends ChatMessageUpsertArgs>(args: SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessage.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageCountArgs>(
      args?: Subset<T, ChatMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessageAggregateArgs>(args: Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>

    /**
     * Group by ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMessageGroupByArgs['orderBy'] }
        : { orderBy?: ChatMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatMessage model
   */
  readonly fields: ChatMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends ChatSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatSessionDefaultArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatMessage model
   */
  interface ChatMessageFieldRefs {
    readonly id: FieldRef<"ChatMessage", 'Int'>
    readonly sessionId: FieldRef<"ChatMessage", 'String'>
    readonly role: FieldRef<"ChatMessage", 'String'>
    readonly content: FieldRef<"ChatMessage", 'String'>
    readonly metadata: FieldRef<"ChatMessage", 'Json'>
    readonly createdAt: FieldRef<"ChatMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatMessage findUnique
   */
  export type ChatMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findUniqueOrThrow
   */
  export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findFirst
   */
  export type ChatMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findFirstOrThrow
   */
  export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findMany
   */
  export type ChatMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessages to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage create
   */
  export type ChatMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatMessage.
     */
    data: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
  }

  /**
   * ChatMessage createMany
   */
  export type ChatMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatMessage createManyAndReturn
   */
  export type ChatMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage update
   */
  export type ChatMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatMessage.
     */
    data: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
    /**
     * Choose, which ChatMessage to update.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage updateMany
   */
  export type ChatMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
  }

  /**
   * ChatMessage updateManyAndReturn
   */
  export type ChatMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage upsert
   */
  export type ChatMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatMessage to update in case it exists.
     */
    where: ChatMessageWhereUniqueInput
    /**
     * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
     */
    create: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
    /**
     * In case the ChatMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
  }

  /**
   * ChatMessage delete
   */
  export type ChatMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter which ChatMessage to delete.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage deleteMany
   */
  export type ChatMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessages to delete
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to delete.
     */
    limit?: number
  }

  /**
   * ChatMessage without action
   */
  export type ChatMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
  }


  /**
   * Model Source
   */

  export type AggregateSource = {
    _count: SourceCountAggregateOutputType | null
    _avg: SourceAvgAggregateOutputType | null
    _sum: SourceSumAggregateOutputType | null
    _min: SourceMinAggregateOutputType | null
    _max: SourceMaxAggregateOutputType | null
  }

  export type SourceAvgAggregateOutputType = {
    userId: number | null
    fileSize: number | null
  }

  export type SourceSumAggregateOutputType = {
    userId: number | null
    fileSize: number | null
  }

  export type SourceMinAggregateOutputType = {
    id: string | null
    userId: number | null
    sessionId: string | null
    fileName: string | null
    filePath: string | null
    fileType: string | null
    fileSize: number | null
    uploadedAt: Date | null
  }

  export type SourceMaxAggregateOutputType = {
    id: string | null
    userId: number | null
    sessionId: string | null
    fileName: string | null
    filePath: string | null
    fileType: string | null
    fileSize: number | null
    uploadedAt: Date | null
  }

  export type SourceCountAggregateOutputType = {
    id: number
    userId: number
    sessionId: number
    fileName: number
    filePath: number
    fileType: number
    fileSize: number
    uploadedAt: number
    _all: number
  }


  export type SourceAvgAggregateInputType = {
    userId?: true
    fileSize?: true
  }

  export type SourceSumAggregateInputType = {
    userId?: true
    fileSize?: true
  }

  export type SourceMinAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    fileName?: true
    filePath?: true
    fileType?: true
    fileSize?: true
    uploadedAt?: true
  }

  export type SourceMaxAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    fileName?: true
    filePath?: true
    fileType?: true
    fileSize?: true
    uploadedAt?: true
  }

  export type SourceCountAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    fileName?: true
    filePath?: true
    fileType?: true
    fileSize?: true
    uploadedAt?: true
    _all?: true
  }

  export type SourceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Source to aggregate.
     */
    where?: SourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sources to fetch.
     */
    orderBy?: SourceOrderByWithRelationInput | SourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sources
    **/
    _count?: true | SourceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SourceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SourceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SourceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SourceMaxAggregateInputType
  }

  export type GetSourceAggregateType<T extends SourceAggregateArgs> = {
        [P in keyof T & keyof AggregateSource]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSource[P]>
      : GetScalarType<T[P], AggregateSource[P]>
  }




  export type SourceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SourceWhereInput
    orderBy?: SourceOrderByWithAggregationInput | SourceOrderByWithAggregationInput[]
    by: SourceScalarFieldEnum[] | SourceScalarFieldEnum
    having?: SourceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SourceCountAggregateInputType | true
    _avg?: SourceAvgAggregateInputType
    _sum?: SourceSumAggregateInputType
    _min?: SourceMinAggregateInputType
    _max?: SourceMaxAggregateInputType
  }

  export type SourceGroupByOutputType = {
    id: string
    userId: number
    sessionId: string | null
    fileName: string
    filePath: string
    fileType: string
    fileSize: number
    uploadedAt: Date
    _count: SourceCountAggregateOutputType | null
    _avg: SourceAvgAggregateOutputType | null
    _sum: SourceSumAggregateOutputType | null
    _min: SourceMinAggregateOutputType | null
    _max: SourceMaxAggregateOutputType | null
  }

  type GetSourceGroupByPayload<T extends SourceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SourceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SourceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SourceGroupByOutputType[P]>
            : GetScalarType<T[P], SourceGroupByOutputType[P]>
        }
      >
    >


  export type SourceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    fileName?: boolean
    filePath?: boolean
    fileType?: boolean
    fileSize?: boolean
    uploadedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    session?: boolean | Source$sessionArgs<ExtArgs>
    chunks?: boolean | Source$chunksArgs<ExtArgs>
    _count?: boolean | SourceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["source"]>

  export type SourceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    fileName?: boolean
    filePath?: boolean
    fileType?: boolean
    fileSize?: boolean
    uploadedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    session?: boolean | Source$sessionArgs<ExtArgs>
  }, ExtArgs["result"]["source"]>

  export type SourceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    fileName?: boolean
    filePath?: boolean
    fileType?: boolean
    fileSize?: boolean
    uploadedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    session?: boolean | Source$sessionArgs<ExtArgs>
  }, ExtArgs["result"]["source"]>

  export type SourceSelectScalar = {
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    fileName?: boolean
    filePath?: boolean
    fileType?: boolean
    fileSize?: boolean
    uploadedAt?: boolean
  }

  export type SourceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "sessionId" | "fileName" | "filePath" | "fileType" | "fileSize" | "uploadedAt", ExtArgs["result"]["source"]>
  export type SourceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    session?: boolean | Source$sessionArgs<ExtArgs>
    chunks?: boolean | Source$chunksArgs<ExtArgs>
    _count?: boolean | SourceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SourceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    session?: boolean | Source$sessionArgs<ExtArgs>
  }
  export type SourceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    session?: boolean | Source$sessionArgs<ExtArgs>
  }

  export type $SourcePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Source"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      session: Prisma.$ChatSessionPayload<ExtArgs> | null
      chunks: Prisma.$SourceChunkPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: number
      sessionId: string | null
      fileName: string
      filePath: string
      fileType: string
      fileSize: number
      uploadedAt: Date
    }, ExtArgs["result"]["source"]>
    composites: {}
  }

  type SourceGetPayload<S extends boolean | null | undefined | SourceDefaultArgs> = $Result.GetResult<Prisma.$SourcePayload, S>

  type SourceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SourceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SourceCountAggregateInputType | true
    }

  export interface SourceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Source'], meta: { name: 'Source' } }
    /**
     * Find zero or one Source that matches the filter.
     * @param {SourceFindUniqueArgs} args - Arguments to find a Source
     * @example
     * // Get one Source
     * const source = await prisma.source.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SourceFindUniqueArgs>(args: SelectSubset<T, SourceFindUniqueArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Source that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SourceFindUniqueOrThrowArgs} args - Arguments to find a Source
     * @example
     * // Get one Source
     * const source = await prisma.source.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SourceFindUniqueOrThrowArgs>(args: SelectSubset<T, SourceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Source that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceFindFirstArgs} args - Arguments to find a Source
     * @example
     * // Get one Source
     * const source = await prisma.source.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SourceFindFirstArgs>(args?: SelectSubset<T, SourceFindFirstArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Source that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceFindFirstOrThrowArgs} args - Arguments to find a Source
     * @example
     * // Get one Source
     * const source = await prisma.source.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SourceFindFirstOrThrowArgs>(args?: SelectSubset<T, SourceFindFirstOrThrowArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sources
     * const sources = await prisma.source.findMany()
     * 
     * // Get first 10 Sources
     * const sources = await prisma.source.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sourceWithIdOnly = await prisma.source.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SourceFindManyArgs>(args?: SelectSubset<T, SourceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Source.
     * @param {SourceCreateArgs} args - Arguments to create a Source.
     * @example
     * // Create one Source
     * const Source = await prisma.source.create({
     *   data: {
     *     // ... data to create a Source
     *   }
     * })
     * 
     */
    create<T extends SourceCreateArgs>(args: SelectSubset<T, SourceCreateArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sources.
     * @param {SourceCreateManyArgs} args - Arguments to create many Sources.
     * @example
     * // Create many Sources
     * const source = await prisma.source.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SourceCreateManyArgs>(args?: SelectSubset<T, SourceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sources and returns the data saved in the database.
     * @param {SourceCreateManyAndReturnArgs} args - Arguments to create many Sources.
     * @example
     * // Create many Sources
     * const source = await prisma.source.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sources and only return the `id`
     * const sourceWithIdOnly = await prisma.source.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SourceCreateManyAndReturnArgs>(args?: SelectSubset<T, SourceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Source.
     * @param {SourceDeleteArgs} args - Arguments to delete one Source.
     * @example
     * // Delete one Source
     * const Source = await prisma.source.delete({
     *   where: {
     *     // ... filter to delete one Source
     *   }
     * })
     * 
     */
    delete<T extends SourceDeleteArgs>(args: SelectSubset<T, SourceDeleteArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Source.
     * @param {SourceUpdateArgs} args - Arguments to update one Source.
     * @example
     * // Update one Source
     * const source = await prisma.source.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SourceUpdateArgs>(args: SelectSubset<T, SourceUpdateArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sources.
     * @param {SourceDeleteManyArgs} args - Arguments to filter Sources to delete.
     * @example
     * // Delete a few Sources
     * const { count } = await prisma.source.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SourceDeleteManyArgs>(args?: SelectSubset<T, SourceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sources
     * const source = await prisma.source.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SourceUpdateManyArgs>(args: SelectSubset<T, SourceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sources and returns the data updated in the database.
     * @param {SourceUpdateManyAndReturnArgs} args - Arguments to update many Sources.
     * @example
     * // Update many Sources
     * const source = await prisma.source.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sources and only return the `id`
     * const sourceWithIdOnly = await prisma.source.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SourceUpdateManyAndReturnArgs>(args: SelectSubset<T, SourceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Source.
     * @param {SourceUpsertArgs} args - Arguments to update or create a Source.
     * @example
     * // Update or create a Source
     * const source = await prisma.source.upsert({
     *   create: {
     *     // ... data to create a Source
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Source we want to update
     *   }
     * })
     */
    upsert<T extends SourceUpsertArgs>(args: SelectSubset<T, SourceUpsertArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceCountArgs} args - Arguments to filter Sources to count.
     * @example
     * // Count the number of Sources
     * const count = await prisma.source.count({
     *   where: {
     *     // ... the filter for the Sources we want to count
     *   }
     * })
    **/
    count<T extends SourceCountArgs>(
      args?: Subset<T, SourceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SourceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Source.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SourceAggregateArgs>(args: Subset<T, SourceAggregateArgs>): Prisma.PrismaPromise<GetSourceAggregateType<T>>

    /**
     * Group by Source.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SourceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SourceGroupByArgs['orderBy'] }
        : { orderBy?: SourceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SourceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSourceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Source model
   */
  readonly fields: SourceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Source.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SourceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    session<T extends Source$sessionArgs<ExtArgs> = {}>(args?: Subset<T, Source$sessionArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    chunks<T extends Source$chunksArgs<ExtArgs> = {}>(args?: Subset<T, Source$chunksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourceChunkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Source model
   */
  interface SourceFieldRefs {
    readonly id: FieldRef<"Source", 'String'>
    readonly userId: FieldRef<"Source", 'Int'>
    readonly sessionId: FieldRef<"Source", 'String'>
    readonly fileName: FieldRef<"Source", 'String'>
    readonly filePath: FieldRef<"Source", 'String'>
    readonly fileType: FieldRef<"Source", 'String'>
    readonly fileSize: FieldRef<"Source", 'Int'>
    readonly uploadedAt: FieldRef<"Source", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Source findUnique
   */
  export type SourceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * Filter, which Source to fetch.
     */
    where: SourceWhereUniqueInput
  }

  /**
   * Source findUniqueOrThrow
   */
  export type SourceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * Filter, which Source to fetch.
     */
    where: SourceWhereUniqueInput
  }

  /**
   * Source findFirst
   */
  export type SourceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * Filter, which Source to fetch.
     */
    where?: SourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sources to fetch.
     */
    orderBy?: SourceOrderByWithRelationInput | SourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sources.
     */
    cursor?: SourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sources.
     */
    distinct?: SourceScalarFieldEnum | SourceScalarFieldEnum[]
  }

  /**
   * Source findFirstOrThrow
   */
  export type SourceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * Filter, which Source to fetch.
     */
    where?: SourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sources to fetch.
     */
    orderBy?: SourceOrderByWithRelationInput | SourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sources.
     */
    cursor?: SourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sources.
     */
    distinct?: SourceScalarFieldEnum | SourceScalarFieldEnum[]
  }

  /**
   * Source findMany
   */
  export type SourceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * Filter, which Sources to fetch.
     */
    where?: SourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sources to fetch.
     */
    orderBy?: SourceOrderByWithRelationInput | SourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sources.
     */
    cursor?: SourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sources.
     */
    skip?: number
    distinct?: SourceScalarFieldEnum | SourceScalarFieldEnum[]
  }

  /**
   * Source create
   */
  export type SourceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * The data needed to create a Source.
     */
    data: XOR<SourceCreateInput, SourceUncheckedCreateInput>
  }

  /**
   * Source createMany
   */
  export type SourceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sources.
     */
    data: SourceCreateManyInput | SourceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Source createManyAndReturn
   */
  export type SourceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * The data used to create many Sources.
     */
    data: SourceCreateManyInput | SourceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Source update
   */
  export type SourceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * The data needed to update a Source.
     */
    data: XOR<SourceUpdateInput, SourceUncheckedUpdateInput>
    /**
     * Choose, which Source to update.
     */
    where: SourceWhereUniqueInput
  }

  /**
   * Source updateMany
   */
  export type SourceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sources.
     */
    data: XOR<SourceUpdateManyMutationInput, SourceUncheckedUpdateManyInput>
    /**
     * Filter which Sources to update
     */
    where?: SourceWhereInput
    /**
     * Limit how many Sources to update.
     */
    limit?: number
  }

  /**
   * Source updateManyAndReturn
   */
  export type SourceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * The data used to update Sources.
     */
    data: XOR<SourceUpdateManyMutationInput, SourceUncheckedUpdateManyInput>
    /**
     * Filter which Sources to update
     */
    where?: SourceWhereInput
    /**
     * Limit how many Sources to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Source upsert
   */
  export type SourceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * The filter to search for the Source to update in case it exists.
     */
    where: SourceWhereUniqueInput
    /**
     * In case the Source found by the `where` argument doesn't exist, create a new Source with this data.
     */
    create: XOR<SourceCreateInput, SourceUncheckedCreateInput>
    /**
     * In case the Source was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SourceUpdateInput, SourceUncheckedUpdateInput>
  }

  /**
   * Source delete
   */
  export type SourceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
    /**
     * Filter which Source to delete.
     */
    where: SourceWhereUniqueInput
  }

  /**
   * Source deleteMany
   */
  export type SourceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sources to delete
     */
    where?: SourceWhereInput
    /**
     * Limit how many Sources to delete.
     */
    limit?: number
  }

  /**
   * Source.session
   */
  export type Source$sessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatSession
     */
    omit?: ChatSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    where?: ChatSessionWhereInput
  }

  /**
   * Source.chunks
   */
  export type Source$chunksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceChunk
     */
    select?: SourceChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceChunk
     */
    omit?: SourceChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceChunkInclude<ExtArgs> | null
    where?: SourceChunkWhereInput
    orderBy?: SourceChunkOrderByWithRelationInput | SourceChunkOrderByWithRelationInput[]
    cursor?: SourceChunkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SourceChunkScalarFieldEnum | SourceChunkScalarFieldEnum[]
  }

  /**
   * Source without action
   */
  export type SourceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Source
     */
    select?: SourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Source
     */
    omit?: SourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceInclude<ExtArgs> | null
  }


  /**
   * Model SourceChunk
   */

  export type AggregateSourceChunk = {
    _count: SourceChunkCountAggregateOutputType | null
    _avg: SourceChunkAvgAggregateOutputType | null
    _sum: SourceChunkSumAggregateOutputType | null
    _min: SourceChunkMinAggregateOutputType | null
    _max: SourceChunkMaxAggregateOutputType | null
  }

  export type SourceChunkAvgAggregateOutputType = {
    chunkIndex: number | null
  }

  export type SourceChunkSumAggregateOutputType = {
    chunkIndex: number | null
  }

  export type SourceChunkMinAggregateOutputType = {
    id: string | null
    sourceId: string | null
    content: string | null
    chunkIndex: number | null
  }

  export type SourceChunkMaxAggregateOutputType = {
    id: string | null
    sourceId: string | null
    content: string | null
    chunkIndex: number | null
  }

  export type SourceChunkCountAggregateOutputType = {
    id: number
    sourceId: number
    content: number
    chunkIndex: number
    _all: number
  }


  export type SourceChunkAvgAggregateInputType = {
    chunkIndex?: true
  }

  export type SourceChunkSumAggregateInputType = {
    chunkIndex?: true
  }

  export type SourceChunkMinAggregateInputType = {
    id?: true
    sourceId?: true
    content?: true
    chunkIndex?: true
  }

  export type SourceChunkMaxAggregateInputType = {
    id?: true
    sourceId?: true
    content?: true
    chunkIndex?: true
  }

  export type SourceChunkCountAggregateInputType = {
    id?: true
    sourceId?: true
    content?: true
    chunkIndex?: true
    _all?: true
  }

  export type SourceChunkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SourceChunk to aggregate.
     */
    where?: SourceChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceChunks to fetch.
     */
    orderBy?: SourceChunkOrderByWithRelationInput | SourceChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SourceChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SourceChunks
    **/
    _count?: true | SourceChunkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SourceChunkAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SourceChunkSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SourceChunkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SourceChunkMaxAggregateInputType
  }

  export type GetSourceChunkAggregateType<T extends SourceChunkAggregateArgs> = {
        [P in keyof T & keyof AggregateSourceChunk]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSourceChunk[P]>
      : GetScalarType<T[P], AggregateSourceChunk[P]>
  }




  export type SourceChunkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SourceChunkWhereInput
    orderBy?: SourceChunkOrderByWithAggregationInput | SourceChunkOrderByWithAggregationInput[]
    by: SourceChunkScalarFieldEnum[] | SourceChunkScalarFieldEnum
    having?: SourceChunkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SourceChunkCountAggregateInputType | true
    _avg?: SourceChunkAvgAggregateInputType
    _sum?: SourceChunkSumAggregateInputType
    _min?: SourceChunkMinAggregateInputType
    _max?: SourceChunkMaxAggregateInputType
  }

  export type SourceChunkGroupByOutputType = {
    id: string
    sourceId: string
    content: string
    chunkIndex: number
    _count: SourceChunkCountAggregateOutputType | null
    _avg: SourceChunkAvgAggregateOutputType | null
    _sum: SourceChunkSumAggregateOutputType | null
    _min: SourceChunkMinAggregateOutputType | null
    _max: SourceChunkMaxAggregateOutputType | null
  }

  type GetSourceChunkGroupByPayload<T extends SourceChunkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SourceChunkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SourceChunkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SourceChunkGroupByOutputType[P]>
            : GetScalarType<T[P], SourceChunkGroupByOutputType[P]>
        }
      >
    >


  export type SourceChunkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    content?: boolean
    chunkIndex?: boolean
    source?: boolean | SourceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sourceChunk"]>

  export type SourceChunkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    content?: boolean
    chunkIndex?: boolean
    source?: boolean | SourceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sourceChunk"]>

  export type SourceChunkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sourceId?: boolean
    content?: boolean
    chunkIndex?: boolean
    source?: boolean | SourceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sourceChunk"]>

  export type SourceChunkSelectScalar = {
    id?: boolean
    sourceId?: boolean
    content?: boolean
    chunkIndex?: boolean
  }

  export type SourceChunkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sourceId" | "content" | "chunkIndex", ExtArgs["result"]["sourceChunk"]>
  export type SourceChunkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | SourceDefaultArgs<ExtArgs>
  }
  export type SourceChunkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | SourceDefaultArgs<ExtArgs>
  }
  export type SourceChunkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | SourceDefaultArgs<ExtArgs>
  }

  export type $SourceChunkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SourceChunk"
    objects: {
      source: Prisma.$SourcePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sourceId: string
      content: string
      chunkIndex: number
    }, ExtArgs["result"]["sourceChunk"]>
    composites: {}
  }

  type SourceChunkGetPayload<S extends boolean | null | undefined | SourceChunkDefaultArgs> = $Result.GetResult<Prisma.$SourceChunkPayload, S>

  type SourceChunkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SourceChunkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SourceChunkCountAggregateInputType | true
    }

  export interface SourceChunkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SourceChunk'], meta: { name: 'SourceChunk' } }
    /**
     * Find zero or one SourceChunk that matches the filter.
     * @param {SourceChunkFindUniqueArgs} args - Arguments to find a SourceChunk
     * @example
     * // Get one SourceChunk
     * const sourceChunk = await prisma.sourceChunk.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SourceChunkFindUniqueArgs>(args: SelectSubset<T, SourceChunkFindUniqueArgs<ExtArgs>>): Prisma__SourceChunkClient<$Result.GetResult<Prisma.$SourceChunkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SourceChunk that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SourceChunkFindUniqueOrThrowArgs} args - Arguments to find a SourceChunk
     * @example
     * // Get one SourceChunk
     * const sourceChunk = await prisma.sourceChunk.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SourceChunkFindUniqueOrThrowArgs>(args: SelectSubset<T, SourceChunkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SourceChunkClient<$Result.GetResult<Prisma.$SourceChunkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SourceChunk that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceChunkFindFirstArgs} args - Arguments to find a SourceChunk
     * @example
     * // Get one SourceChunk
     * const sourceChunk = await prisma.sourceChunk.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SourceChunkFindFirstArgs>(args?: SelectSubset<T, SourceChunkFindFirstArgs<ExtArgs>>): Prisma__SourceChunkClient<$Result.GetResult<Prisma.$SourceChunkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SourceChunk that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceChunkFindFirstOrThrowArgs} args - Arguments to find a SourceChunk
     * @example
     * // Get one SourceChunk
     * const sourceChunk = await prisma.sourceChunk.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SourceChunkFindFirstOrThrowArgs>(args?: SelectSubset<T, SourceChunkFindFirstOrThrowArgs<ExtArgs>>): Prisma__SourceChunkClient<$Result.GetResult<Prisma.$SourceChunkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SourceChunks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceChunkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SourceChunks
     * const sourceChunks = await prisma.sourceChunk.findMany()
     * 
     * // Get first 10 SourceChunks
     * const sourceChunks = await prisma.sourceChunk.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sourceChunkWithIdOnly = await prisma.sourceChunk.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SourceChunkFindManyArgs>(args?: SelectSubset<T, SourceChunkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourceChunkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SourceChunk.
     * @param {SourceChunkCreateArgs} args - Arguments to create a SourceChunk.
     * @example
     * // Create one SourceChunk
     * const SourceChunk = await prisma.sourceChunk.create({
     *   data: {
     *     // ... data to create a SourceChunk
     *   }
     * })
     * 
     */
    create<T extends SourceChunkCreateArgs>(args: SelectSubset<T, SourceChunkCreateArgs<ExtArgs>>): Prisma__SourceChunkClient<$Result.GetResult<Prisma.$SourceChunkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SourceChunks.
     * @param {SourceChunkCreateManyArgs} args - Arguments to create many SourceChunks.
     * @example
     * // Create many SourceChunks
     * const sourceChunk = await prisma.sourceChunk.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SourceChunkCreateManyArgs>(args?: SelectSubset<T, SourceChunkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SourceChunks and returns the data saved in the database.
     * @param {SourceChunkCreateManyAndReturnArgs} args - Arguments to create many SourceChunks.
     * @example
     * // Create many SourceChunks
     * const sourceChunk = await prisma.sourceChunk.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SourceChunks and only return the `id`
     * const sourceChunkWithIdOnly = await prisma.sourceChunk.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SourceChunkCreateManyAndReturnArgs>(args?: SelectSubset<T, SourceChunkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourceChunkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SourceChunk.
     * @param {SourceChunkDeleteArgs} args - Arguments to delete one SourceChunk.
     * @example
     * // Delete one SourceChunk
     * const SourceChunk = await prisma.sourceChunk.delete({
     *   where: {
     *     // ... filter to delete one SourceChunk
     *   }
     * })
     * 
     */
    delete<T extends SourceChunkDeleteArgs>(args: SelectSubset<T, SourceChunkDeleteArgs<ExtArgs>>): Prisma__SourceChunkClient<$Result.GetResult<Prisma.$SourceChunkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SourceChunk.
     * @param {SourceChunkUpdateArgs} args - Arguments to update one SourceChunk.
     * @example
     * // Update one SourceChunk
     * const sourceChunk = await prisma.sourceChunk.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SourceChunkUpdateArgs>(args: SelectSubset<T, SourceChunkUpdateArgs<ExtArgs>>): Prisma__SourceChunkClient<$Result.GetResult<Prisma.$SourceChunkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SourceChunks.
     * @param {SourceChunkDeleteManyArgs} args - Arguments to filter SourceChunks to delete.
     * @example
     * // Delete a few SourceChunks
     * const { count } = await prisma.sourceChunk.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SourceChunkDeleteManyArgs>(args?: SelectSubset<T, SourceChunkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SourceChunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceChunkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SourceChunks
     * const sourceChunk = await prisma.sourceChunk.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SourceChunkUpdateManyArgs>(args: SelectSubset<T, SourceChunkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SourceChunks and returns the data updated in the database.
     * @param {SourceChunkUpdateManyAndReturnArgs} args - Arguments to update many SourceChunks.
     * @example
     * // Update many SourceChunks
     * const sourceChunk = await prisma.sourceChunk.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SourceChunks and only return the `id`
     * const sourceChunkWithIdOnly = await prisma.sourceChunk.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SourceChunkUpdateManyAndReturnArgs>(args: SelectSubset<T, SourceChunkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SourceChunkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SourceChunk.
     * @param {SourceChunkUpsertArgs} args - Arguments to update or create a SourceChunk.
     * @example
     * // Update or create a SourceChunk
     * const sourceChunk = await prisma.sourceChunk.upsert({
     *   create: {
     *     // ... data to create a SourceChunk
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SourceChunk we want to update
     *   }
     * })
     */
    upsert<T extends SourceChunkUpsertArgs>(args: SelectSubset<T, SourceChunkUpsertArgs<ExtArgs>>): Prisma__SourceChunkClient<$Result.GetResult<Prisma.$SourceChunkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SourceChunks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceChunkCountArgs} args - Arguments to filter SourceChunks to count.
     * @example
     * // Count the number of SourceChunks
     * const count = await prisma.sourceChunk.count({
     *   where: {
     *     // ... the filter for the SourceChunks we want to count
     *   }
     * })
    **/
    count<T extends SourceChunkCountArgs>(
      args?: Subset<T, SourceChunkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SourceChunkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SourceChunk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceChunkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SourceChunkAggregateArgs>(args: Subset<T, SourceChunkAggregateArgs>): Prisma.PrismaPromise<GetSourceChunkAggregateType<T>>

    /**
     * Group by SourceChunk.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SourceChunkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SourceChunkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SourceChunkGroupByArgs['orderBy'] }
        : { orderBy?: SourceChunkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SourceChunkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSourceChunkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SourceChunk model
   */
  readonly fields: SourceChunkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SourceChunk.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SourceChunkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    source<T extends SourceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SourceDefaultArgs<ExtArgs>>): Prisma__SourceClient<$Result.GetResult<Prisma.$SourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SourceChunk model
   */
  interface SourceChunkFieldRefs {
    readonly id: FieldRef<"SourceChunk", 'String'>
    readonly sourceId: FieldRef<"SourceChunk", 'String'>
    readonly content: FieldRef<"SourceChunk", 'String'>
    readonly chunkIndex: FieldRef<"SourceChunk", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * SourceChunk findUnique
   */
  export type SourceChunkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceChunk
     */
    select?: SourceChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceChunk
     */
    omit?: SourceChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceChunkInclude<ExtArgs> | null
    /**
     * Filter, which SourceChunk to fetch.
     */
    where: SourceChunkWhereUniqueInput
  }

  /**
   * SourceChunk findUniqueOrThrow
   */
  export type SourceChunkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceChunk
     */
    select?: SourceChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceChunk
     */
    omit?: SourceChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceChunkInclude<ExtArgs> | null
    /**
     * Filter, which SourceChunk to fetch.
     */
    where: SourceChunkWhereUniqueInput
  }

  /**
   * SourceChunk findFirst
   */
  export type SourceChunkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceChunk
     */
    select?: SourceChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceChunk
     */
    omit?: SourceChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceChunkInclude<ExtArgs> | null
    /**
     * Filter, which SourceChunk to fetch.
     */
    where?: SourceChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceChunks to fetch.
     */
    orderBy?: SourceChunkOrderByWithRelationInput | SourceChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SourceChunks.
     */
    cursor?: SourceChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SourceChunks.
     */
    distinct?: SourceChunkScalarFieldEnum | SourceChunkScalarFieldEnum[]
  }

  /**
   * SourceChunk findFirstOrThrow
   */
  export type SourceChunkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceChunk
     */
    select?: SourceChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceChunk
     */
    omit?: SourceChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceChunkInclude<ExtArgs> | null
    /**
     * Filter, which SourceChunk to fetch.
     */
    where?: SourceChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceChunks to fetch.
     */
    orderBy?: SourceChunkOrderByWithRelationInput | SourceChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SourceChunks.
     */
    cursor?: SourceChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceChunks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SourceChunks.
     */
    distinct?: SourceChunkScalarFieldEnum | SourceChunkScalarFieldEnum[]
  }

  /**
   * SourceChunk findMany
   */
  export type SourceChunkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceChunk
     */
    select?: SourceChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceChunk
     */
    omit?: SourceChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceChunkInclude<ExtArgs> | null
    /**
     * Filter, which SourceChunks to fetch.
     */
    where?: SourceChunkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SourceChunks to fetch.
     */
    orderBy?: SourceChunkOrderByWithRelationInput | SourceChunkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SourceChunks.
     */
    cursor?: SourceChunkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SourceChunks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SourceChunks.
     */
    skip?: number
    distinct?: SourceChunkScalarFieldEnum | SourceChunkScalarFieldEnum[]
  }

  /**
   * SourceChunk create
   */
  export type SourceChunkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceChunk
     */
    select?: SourceChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceChunk
     */
    omit?: SourceChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceChunkInclude<ExtArgs> | null
    /**
     * The data needed to create a SourceChunk.
     */
    data: XOR<SourceChunkCreateInput, SourceChunkUncheckedCreateInput>
  }

  /**
   * SourceChunk createMany
   */
  export type SourceChunkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SourceChunks.
     */
    data: SourceChunkCreateManyInput | SourceChunkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SourceChunk createManyAndReturn
   */
  export type SourceChunkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceChunk
     */
    select?: SourceChunkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SourceChunk
     */
    omit?: SourceChunkOmit<ExtArgs> | null
    /**
     * The data used to create many SourceChunks.
     */
    data: SourceChunkCreateManyInput | SourceChunkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceChunkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SourceChunk update
   */
  export type SourceChunkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceChunk
     */
    select?: SourceChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceChunk
     */
    omit?: SourceChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceChunkInclude<ExtArgs> | null
    /**
     * The data needed to update a SourceChunk.
     */
    data: XOR<SourceChunkUpdateInput, SourceChunkUncheckedUpdateInput>
    /**
     * Choose, which SourceChunk to update.
     */
    where: SourceChunkWhereUniqueInput
  }

  /**
   * SourceChunk updateMany
   */
  export type SourceChunkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SourceChunks.
     */
    data: XOR<SourceChunkUpdateManyMutationInput, SourceChunkUncheckedUpdateManyInput>
    /**
     * Filter which SourceChunks to update
     */
    where?: SourceChunkWhereInput
    /**
     * Limit how many SourceChunks to update.
     */
    limit?: number
  }

  /**
   * SourceChunk updateManyAndReturn
   */
  export type SourceChunkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceChunk
     */
    select?: SourceChunkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SourceChunk
     */
    omit?: SourceChunkOmit<ExtArgs> | null
    /**
     * The data used to update SourceChunks.
     */
    data: XOR<SourceChunkUpdateManyMutationInput, SourceChunkUncheckedUpdateManyInput>
    /**
     * Filter which SourceChunks to update
     */
    where?: SourceChunkWhereInput
    /**
     * Limit how many SourceChunks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceChunkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SourceChunk upsert
   */
  export type SourceChunkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceChunk
     */
    select?: SourceChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceChunk
     */
    omit?: SourceChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceChunkInclude<ExtArgs> | null
    /**
     * The filter to search for the SourceChunk to update in case it exists.
     */
    where: SourceChunkWhereUniqueInput
    /**
     * In case the SourceChunk found by the `where` argument doesn't exist, create a new SourceChunk with this data.
     */
    create: XOR<SourceChunkCreateInput, SourceChunkUncheckedCreateInput>
    /**
     * In case the SourceChunk was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SourceChunkUpdateInput, SourceChunkUncheckedUpdateInput>
  }

  /**
   * SourceChunk delete
   */
  export type SourceChunkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceChunk
     */
    select?: SourceChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceChunk
     */
    omit?: SourceChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceChunkInclude<ExtArgs> | null
    /**
     * Filter which SourceChunk to delete.
     */
    where: SourceChunkWhereUniqueInput
  }

  /**
   * SourceChunk deleteMany
   */
  export type SourceChunkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SourceChunks to delete
     */
    where?: SourceChunkWhereInput
    /**
     * Limit how many SourceChunks to delete.
     */
    limit?: number
  }

  /**
   * SourceChunk without action
   */
  export type SourceChunkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SourceChunk
     */
    select?: SourceChunkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SourceChunk
     */
    omit?: SourceChunkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SourceChunkInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    department: 'department',
    avatarUrl: 'avatarUrl',
    isActive: 'isActive',
    preferredLanguage: 'preferredLanguage'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    message: 'message',
    type: 'type',
    channel: 'channel',
    refType: 'refType',
    refId: 'refId',
    isRead: 'isRead',
    createdAt: 'createdAt',
    readAt: 'readAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const FeedbackScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    description: 'description',
    status: 'status',
    adminComment: 'adminComment',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FeedbackScalarFieldEnum = (typeof FeedbackScalarFieldEnum)[keyof typeof FeedbackScalarFieldEnum]


  export const RoleChangeAuditScalarFieldEnum: {
    id: 'id',
    targetId: 'targetId',
    fromRole: 'fromRole',
    toRole: 'toRole',
    actorEmail: 'actorEmail',
    actorName: 'actorName',
    createdAt: 'createdAt'
  };

  export type RoleChangeAuditScalarFieldEnum = (typeof RoleChangeAuditScalarFieldEnum)[keyof typeof RoleChangeAuditScalarFieldEnum]


  export const PasswordResetCodeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    email: 'email',
    codeHash: 'codeHash',
    salt: 'salt',
    attempts: 'attempts',
    expiresAt: 'expiresAt',
    usedAt: 'usedAt',
    createdAt: 'createdAt'
  };

  export type PasswordResetCodeScalarFieldEnum = (typeof PasswordResetCodeScalarFieldEnum)[keyof typeof PasswordResetCodeScalarFieldEnum]


  export const PurchasingLookupScalarFieldEnum: {
    id: 'id',
    kind: 'kind',
    value: 'value',
    createdAt: 'createdAt'
  };

  export type PurchasingLookupScalarFieldEnum = (typeof PurchasingLookupScalarFieldEnum)[keyof typeof PurchasingLookupScalarFieldEnum]


  export const SupplierTypeAssignmentScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    category: 'category',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SupplierTypeAssignmentScalarFieldEnum = (typeof SupplierTypeAssignmentScalarFieldEnum)[keyof typeof SupplierTypeAssignmentScalarFieldEnum]


  export const PurchaseRequestRecordScalarFieldEnum: {
    localId: 'localId',
    payload: 'payload',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PurchaseRequestRecordScalarFieldEnum = (typeof PurchaseRequestRecordScalarFieldEnum)[keyof typeof PurchaseRequestRecordScalarFieldEnum]


  export const PurchaseOrderRecordScalarFieldEnum: {
    localId: 'localId',
    payload: 'payload',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PurchaseOrderRecordScalarFieldEnum = (typeof PurchaseOrderRecordScalarFieldEnum)[keyof typeof PurchaseOrderRecordScalarFieldEnum]


  export const SupplierOrderAcknowledgementRecordScalarFieldEnum: {
    localId: 'localId',
    payload: 'payload',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SupplierOrderAcknowledgementRecordScalarFieldEnum = (typeof SupplierOrderAcknowledgementRecordScalarFieldEnum)[keyof typeof SupplierOrderAcknowledgementRecordScalarFieldEnum]


  export const SupplierDeliveryRecordStoreScalarFieldEnum: {
    localId: 'localId',
    payload: 'payload',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SupplierDeliveryRecordStoreScalarFieldEnum = (typeof SupplierDeliveryRecordStoreScalarFieldEnum)[keyof typeof SupplierDeliveryRecordStoreScalarFieldEnum]


  export const SupplierGrnRecordStoreScalarFieldEnum: {
    localId: 'localId',
    payload: 'payload',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SupplierGrnRecordStoreScalarFieldEnum = (typeof SupplierGrnRecordStoreScalarFieldEnum)[keyof typeof SupplierGrnRecordStoreScalarFieldEnum]


  export const ChatSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChatSessionScalarFieldEnum = (typeof ChatSessionScalarFieldEnum)[keyof typeof ChatSessionScalarFieldEnum]


  export const ChatMessageScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    role: 'role',
    content: 'content',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum]


  export const SourceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    sessionId: 'sessionId',
    fileName: 'fileName',
    filePath: 'filePath',
    fileType: 'fileType',
    fileSize: 'fileSize',
    uploadedAt: 'uploadedAt'
  };

  export type SourceScalarFieldEnum = (typeof SourceScalarFieldEnum)[keyof typeof SourceScalarFieldEnum]


  export const SourceChunkScalarFieldEnum: {
    id: 'id',
    sourceId: 'sourceId',
    content: 'content',
    chunkIndex: 'chunkIndex'
  };

  export type SourceChunkScalarFieldEnum = (typeof SourceChunkScalarFieldEnum)[keyof typeof SourceChunkScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Language'
   */
  export type EnumLanguageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Language'>
    


  /**
   * Reference to a field of type 'Language[]'
   */
  export type ListEnumLanguageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Language[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    department?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    preferredLanguage?: EnumLanguageFilter<"User"> | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditListRelationFilter
    passwordResetCodes?: PasswordResetCodeListRelationFilter
    supplierTypeAssignments?: SupplierTypeAssignmentListRelationFilter
    notifications?: NotificationListRelationFilter
    feedbacks?: FeedbackListRelationFilter
    chatSessions?: ChatSessionListRelationFilter
    sources?: SourceListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    department?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    preferredLanguage?: SortOrder
    roleChangeAuditsAsTarget?: RoleChangeAuditOrderByRelationAggregateInput
    passwordResetCodes?: PasswordResetCodeOrderByRelationAggregateInput
    supplierTypeAssignments?: SupplierTypeAssignmentOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    feedbacks?: FeedbackOrderByRelationAggregateInput
    chatSessions?: ChatSessionOrderByRelationAggregateInput
    sources?: SourceOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    department?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    preferredLanguage?: EnumLanguageFilter<"User"> | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditListRelationFilter
    passwordResetCodes?: PasswordResetCodeListRelationFilter
    supplierTypeAssignments?: SupplierTypeAssignmentListRelationFilter
    notifications?: NotificationListRelationFilter
    feedbacks?: FeedbackListRelationFilter
    chatSessions?: ChatSessionListRelationFilter
    sources?: SourceListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    department?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    isActive?: SortOrder
    preferredLanguage?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    department?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    preferredLanguage?: EnumLanguageWithAggregatesFilter<"User"> | $Enums.Language
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: IntFilter<"Notification"> | number
    userId?: IntFilter<"Notification"> | number
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    channel?: StringFilter<"Notification"> | string
    refType?: StringNullableFilter<"Notification"> | string | null
    refId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    readAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    channel?: SortOrder
    refType?: SortOrderInput | SortOrder
    refId?: SortOrderInput | SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: IntFilter<"Notification"> | number
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    channel?: StringFilter<"Notification"> | string
    refType?: StringNullableFilter<"Notification"> | string | null
    refId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    readAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    channel?: SortOrder
    refType?: SortOrderInput | SortOrder
    refId?: SortOrderInput | SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrderInput | SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _avg?: NotificationAvgOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
    _sum?: NotificationSumOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Notification"> | number
    userId?: IntWithAggregatesFilter<"Notification"> | number
    title?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringWithAggregatesFilter<"Notification"> | string
    type?: StringWithAggregatesFilter<"Notification"> | string
    channel?: StringWithAggregatesFilter<"Notification"> | string
    refType?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    refId?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    isRead?: BoolWithAggregatesFilter<"Notification"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
    readAt?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
  }

  export type FeedbackWhereInput = {
    AND?: FeedbackWhereInput | FeedbackWhereInput[]
    OR?: FeedbackWhereInput[]
    NOT?: FeedbackWhereInput | FeedbackWhereInput[]
    id?: IntFilter<"Feedback"> | number
    userId?: IntFilter<"Feedback"> | number
    type?: StringFilter<"Feedback"> | string
    description?: StringFilter<"Feedback"> | string
    status?: StringFilter<"Feedback"> | string
    adminComment?: StringNullableFilter<"Feedback"> | string | null
    createdAt?: DateTimeFilter<"Feedback"> | Date | string
    updatedAt?: DateTimeFilter<"Feedback"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FeedbackOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    status?: SortOrder
    adminComment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type FeedbackWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: FeedbackWhereInput | FeedbackWhereInput[]
    OR?: FeedbackWhereInput[]
    NOT?: FeedbackWhereInput | FeedbackWhereInput[]
    userId?: IntFilter<"Feedback"> | number
    type?: StringFilter<"Feedback"> | string
    description?: StringFilter<"Feedback"> | string
    status?: StringFilter<"Feedback"> | string
    adminComment?: StringNullableFilter<"Feedback"> | string | null
    createdAt?: DateTimeFilter<"Feedback"> | Date | string
    updatedAt?: DateTimeFilter<"Feedback"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type FeedbackOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    status?: SortOrder
    adminComment?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FeedbackCountOrderByAggregateInput
    _avg?: FeedbackAvgOrderByAggregateInput
    _max?: FeedbackMaxOrderByAggregateInput
    _min?: FeedbackMinOrderByAggregateInput
    _sum?: FeedbackSumOrderByAggregateInput
  }

  export type FeedbackScalarWhereWithAggregatesInput = {
    AND?: FeedbackScalarWhereWithAggregatesInput | FeedbackScalarWhereWithAggregatesInput[]
    OR?: FeedbackScalarWhereWithAggregatesInput[]
    NOT?: FeedbackScalarWhereWithAggregatesInput | FeedbackScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Feedback"> | number
    userId?: IntWithAggregatesFilter<"Feedback"> | number
    type?: StringWithAggregatesFilter<"Feedback"> | string
    description?: StringWithAggregatesFilter<"Feedback"> | string
    status?: StringWithAggregatesFilter<"Feedback"> | string
    adminComment?: StringNullableWithAggregatesFilter<"Feedback"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Feedback"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Feedback"> | Date | string
  }

  export type RoleChangeAuditWhereInput = {
    AND?: RoleChangeAuditWhereInput | RoleChangeAuditWhereInput[]
    OR?: RoleChangeAuditWhereInput[]
    NOT?: RoleChangeAuditWhereInput | RoleChangeAuditWhereInput[]
    id?: IntFilter<"RoleChangeAudit"> | number
    targetId?: IntFilter<"RoleChangeAudit"> | number
    fromRole?: StringFilter<"RoleChangeAudit"> | string
    toRole?: StringFilter<"RoleChangeAudit"> | string
    actorEmail?: StringFilter<"RoleChangeAudit"> | string
    actorName?: StringNullableFilter<"RoleChangeAudit"> | string | null
    createdAt?: DateTimeFilter<"RoleChangeAudit"> | Date | string
    target?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type RoleChangeAuditOrderByWithRelationInput = {
    id?: SortOrder
    targetId?: SortOrder
    fromRole?: SortOrder
    toRole?: SortOrder
    actorEmail?: SortOrder
    actorName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    target?: UserOrderByWithRelationInput
  }

  export type RoleChangeAuditWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RoleChangeAuditWhereInput | RoleChangeAuditWhereInput[]
    OR?: RoleChangeAuditWhereInput[]
    NOT?: RoleChangeAuditWhereInput | RoleChangeAuditWhereInput[]
    targetId?: IntFilter<"RoleChangeAudit"> | number
    fromRole?: StringFilter<"RoleChangeAudit"> | string
    toRole?: StringFilter<"RoleChangeAudit"> | string
    actorEmail?: StringFilter<"RoleChangeAudit"> | string
    actorName?: StringNullableFilter<"RoleChangeAudit"> | string | null
    createdAt?: DateTimeFilter<"RoleChangeAudit"> | Date | string
    target?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type RoleChangeAuditOrderByWithAggregationInput = {
    id?: SortOrder
    targetId?: SortOrder
    fromRole?: SortOrder
    toRole?: SortOrder
    actorEmail?: SortOrder
    actorName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RoleChangeAuditCountOrderByAggregateInput
    _avg?: RoleChangeAuditAvgOrderByAggregateInput
    _max?: RoleChangeAuditMaxOrderByAggregateInput
    _min?: RoleChangeAuditMinOrderByAggregateInput
    _sum?: RoleChangeAuditSumOrderByAggregateInput
  }

  export type RoleChangeAuditScalarWhereWithAggregatesInput = {
    AND?: RoleChangeAuditScalarWhereWithAggregatesInput | RoleChangeAuditScalarWhereWithAggregatesInput[]
    OR?: RoleChangeAuditScalarWhereWithAggregatesInput[]
    NOT?: RoleChangeAuditScalarWhereWithAggregatesInput | RoleChangeAuditScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RoleChangeAudit"> | number
    targetId?: IntWithAggregatesFilter<"RoleChangeAudit"> | number
    fromRole?: StringWithAggregatesFilter<"RoleChangeAudit"> | string
    toRole?: StringWithAggregatesFilter<"RoleChangeAudit"> | string
    actorEmail?: StringWithAggregatesFilter<"RoleChangeAudit"> | string
    actorName?: StringNullableWithAggregatesFilter<"RoleChangeAudit"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RoleChangeAudit"> | Date | string
  }

  export type PasswordResetCodeWhereInput = {
    AND?: PasswordResetCodeWhereInput | PasswordResetCodeWhereInput[]
    OR?: PasswordResetCodeWhereInput[]
    NOT?: PasswordResetCodeWhereInput | PasswordResetCodeWhereInput[]
    id?: IntFilter<"PasswordResetCode"> | number
    userId?: IntFilter<"PasswordResetCode"> | number
    email?: StringFilter<"PasswordResetCode"> | string
    codeHash?: StringFilter<"PasswordResetCode"> | string
    salt?: StringFilter<"PasswordResetCode"> | string
    attempts?: IntFilter<"PasswordResetCode"> | number
    expiresAt?: DateTimeFilter<"PasswordResetCode"> | Date | string
    usedAt?: DateTimeNullableFilter<"PasswordResetCode"> | Date | string | null
    createdAt?: DateTimeFilter<"PasswordResetCode"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PasswordResetCodeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    codeHash?: SortOrder
    salt?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PasswordResetCodeWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PasswordResetCodeWhereInput | PasswordResetCodeWhereInput[]
    OR?: PasswordResetCodeWhereInput[]
    NOT?: PasswordResetCodeWhereInput | PasswordResetCodeWhereInput[]
    userId?: IntFilter<"PasswordResetCode"> | number
    email?: StringFilter<"PasswordResetCode"> | string
    codeHash?: StringFilter<"PasswordResetCode"> | string
    salt?: StringFilter<"PasswordResetCode"> | string
    attempts?: IntFilter<"PasswordResetCode"> | number
    expiresAt?: DateTimeFilter<"PasswordResetCode"> | Date | string
    usedAt?: DateTimeNullableFilter<"PasswordResetCode"> | Date | string | null
    createdAt?: DateTimeFilter<"PasswordResetCode"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type PasswordResetCodeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    codeHash?: SortOrder
    salt?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PasswordResetCodeCountOrderByAggregateInput
    _avg?: PasswordResetCodeAvgOrderByAggregateInput
    _max?: PasswordResetCodeMaxOrderByAggregateInput
    _min?: PasswordResetCodeMinOrderByAggregateInput
    _sum?: PasswordResetCodeSumOrderByAggregateInput
  }

  export type PasswordResetCodeScalarWhereWithAggregatesInput = {
    AND?: PasswordResetCodeScalarWhereWithAggregatesInput | PasswordResetCodeScalarWhereWithAggregatesInput[]
    OR?: PasswordResetCodeScalarWhereWithAggregatesInput[]
    NOT?: PasswordResetCodeScalarWhereWithAggregatesInput | PasswordResetCodeScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PasswordResetCode"> | number
    userId?: IntWithAggregatesFilter<"PasswordResetCode"> | number
    email?: StringWithAggregatesFilter<"PasswordResetCode"> | string
    codeHash?: StringWithAggregatesFilter<"PasswordResetCode"> | string
    salt?: StringWithAggregatesFilter<"PasswordResetCode"> | string
    attempts?: IntWithAggregatesFilter<"PasswordResetCode"> | number
    expiresAt?: DateTimeWithAggregatesFilter<"PasswordResetCode"> | Date | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"PasswordResetCode"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PasswordResetCode"> | Date | string
  }

  export type PurchasingLookupWhereInput = {
    AND?: PurchasingLookupWhereInput | PurchasingLookupWhereInput[]
    OR?: PurchasingLookupWhereInput[]
    NOT?: PurchasingLookupWhereInput | PurchasingLookupWhereInput[]
    id?: IntFilter<"PurchasingLookup"> | number
    kind?: StringFilter<"PurchasingLookup"> | string
    value?: StringFilter<"PurchasingLookup"> | string
    createdAt?: DateTimeFilter<"PurchasingLookup"> | Date | string
  }

  export type PurchasingLookupOrderByWithRelationInput = {
    id?: SortOrder
    kind?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type PurchasingLookupWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    kind_value?: PurchasingLookupKindValueCompoundUniqueInput
    AND?: PurchasingLookupWhereInput | PurchasingLookupWhereInput[]
    OR?: PurchasingLookupWhereInput[]
    NOT?: PurchasingLookupWhereInput | PurchasingLookupWhereInput[]
    kind?: StringFilter<"PurchasingLookup"> | string
    value?: StringFilter<"PurchasingLookup"> | string
    createdAt?: DateTimeFilter<"PurchasingLookup"> | Date | string
  }, "id" | "kind_value">

  export type PurchasingLookupOrderByWithAggregationInput = {
    id?: SortOrder
    kind?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    _count?: PurchasingLookupCountOrderByAggregateInput
    _avg?: PurchasingLookupAvgOrderByAggregateInput
    _max?: PurchasingLookupMaxOrderByAggregateInput
    _min?: PurchasingLookupMinOrderByAggregateInput
    _sum?: PurchasingLookupSumOrderByAggregateInput
  }

  export type PurchasingLookupScalarWhereWithAggregatesInput = {
    AND?: PurchasingLookupScalarWhereWithAggregatesInput | PurchasingLookupScalarWhereWithAggregatesInput[]
    OR?: PurchasingLookupScalarWhereWithAggregatesInput[]
    NOT?: PurchasingLookupScalarWhereWithAggregatesInput | PurchasingLookupScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PurchasingLookup"> | number
    kind?: StringWithAggregatesFilter<"PurchasingLookup"> | string
    value?: StringWithAggregatesFilter<"PurchasingLookup"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PurchasingLookup"> | Date | string
  }

  export type SupplierTypeAssignmentWhereInput = {
    AND?: SupplierTypeAssignmentWhereInput | SupplierTypeAssignmentWhereInput[]
    OR?: SupplierTypeAssignmentWhereInput[]
    NOT?: SupplierTypeAssignmentWhereInput | SupplierTypeAssignmentWhereInput[]
    id?: IntFilter<"SupplierTypeAssignment"> | number
    userId?: IntFilter<"SupplierTypeAssignment"> | number
    category?: StringFilter<"SupplierTypeAssignment"> | string
    createdAt?: DateTimeFilter<"SupplierTypeAssignment"> | Date | string
    updatedAt?: DateTimeFilter<"SupplierTypeAssignment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SupplierTypeAssignmentOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SupplierTypeAssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId_category?: SupplierTypeAssignmentUserIdCategoryCompoundUniqueInput
    AND?: SupplierTypeAssignmentWhereInput | SupplierTypeAssignmentWhereInput[]
    OR?: SupplierTypeAssignmentWhereInput[]
    NOT?: SupplierTypeAssignmentWhereInput | SupplierTypeAssignmentWhereInput[]
    userId?: IntFilter<"SupplierTypeAssignment"> | number
    category?: StringFilter<"SupplierTypeAssignment"> | string
    createdAt?: DateTimeFilter<"SupplierTypeAssignment"> | Date | string
    updatedAt?: DateTimeFilter<"SupplierTypeAssignment"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_category">

  export type SupplierTypeAssignmentOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SupplierTypeAssignmentCountOrderByAggregateInput
    _avg?: SupplierTypeAssignmentAvgOrderByAggregateInput
    _max?: SupplierTypeAssignmentMaxOrderByAggregateInput
    _min?: SupplierTypeAssignmentMinOrderByAggregateInput
    _sum?: SupplierTypeAssignmentSumOrderByAggregateInput
  }

  export type SupplierTypeAssignmentScalarWhereWithAggregatesInput = {
    AND?: SupplierTypeAssignmentScalarWhereWithAggregatesInput | SupplierTypeAssignmentScalarWhereWithAggregatesInput[]
    OR?: SupplierTypeAssignmentScalarWhereWithAggregatesInput[]
    NOT?: SupplierTypeAssignmentScalarWhereWithAggregatesInput | SupplierTypeAssignmentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SupplierTypeAssignment"> | number
    userId?: IntWithAggregatesFilter<"SupplierTypeAssignment"> | number
    category?: StringWithAggregatesFilter<"SupplierTypeAssignment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SupplierTypeAssignment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SupplierTypeAssignment"> | Date | string
  }

  export type PurchaseRequestRecordWhereInput = {
    AND?: PurchaseRequestRecordWhereInput | PurchaseRequestRecordWhereInput[]
    OR?: PurchaseRequestRecordWhereInput[]
    NOT?: PurchaseRequestRecordWhereInput | PurchaseRequestRecordWhereInput[]
    localId?: StringFilter<"PurchaseRequestRecord"> | string
    payload?: JsonFilter<"PurchaseRequestRecord">
    createdAt?: DateTimeFilter<"PurchaseRequestRecord"> | Date | string
    updatedAt?: DateTimeFilter<"PurchaseRequestRecord"> | Date | string
  }

  export type PurchaseRequestRecordOrderByWithRelationInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseRequestRecordWhereUniqueInput = Prisma.AtLeast<{
    localId?: string
    AND?: PurchaseRequestRecordWhereInput | PurchaseRequestRecordWhereInput[]
    OR?: PurchaseRequestRecordWhereInput[]
    NOT?: PurchaseRequestRecordWhereInput | PurchaseRequestRecordWhereInput[]
    payload?: JsonFilter<"PurchaseRequestRecord">
    createdAt?: DateTimeFilter<"PurchaseRequestRecord"> | Date | string
    updatedAt?: DateTimeFilter<"PurchaseRequestRecord"> | Date | string
  }, "localId">

  export type PurchaseRequestRecordOrderByWithAggregationInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PurchaseRequestRecordCountOrderByAggregateInput
    _max?: PurchaseRequestRecordMaxOrderByAggregateInput
    _min?: PurchaseRequestRecordMinOrderByAggregateInput
  }

  export type PurchaseRequestRecordScalarWhereWithAggregatesInput = {
    AND?: PurchaseRequestRecordScalarWhereWithAggregatesInput | PurchaseRequestRecordScalarWhereWithAggregatesInput[]
    OR?: PurchaseRequestRecordScalarWhereWithAggregatesInput[]
    NOT?: PurchaseRequestRecordScalarWhereWithAggregatesInput | PurchaseRequestRecordScalarWhereWithAggregatesInput[]
    localId?: StringWithAggregatesFilter<"PurchaseRequestRecord"> | string
    payload?: JsonWithAggregatesFilter<"PurchaseRequestRecord">
    createdAt?: DateTimeWithAggregatesFilter<"PurchaseRequestRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PurchaseRequestRecord"> | Date | string
  }

  export type PurchaseOrderRecordWhereInput = {
    AND?: PurchaseOrderRecordWhereInput | PurchaseOrderRecordWhereInput[]
    OR?: PurchaseOrderRecordWhereInput[]
    NOT?: PurchaseOrderRecordWhereInput | PurchaseOrderRecordWhereInput[]
    localId?: StringFilter<"PurchaseOrderRecord"> | string
    payload?: JsonFilter<"PurchaseOrderRecord">
    createdAt?: DateTimeFilter<"PurchaseOrderRecord"> | Date | string
    updatedAt?: DateTimeFilter<"PurchaseOrderRecord"> | Date | string
  }

  export type PurchaseOrderRecordOrderByWithRelationInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseOrderRecordWhereUniqueInput = Prisma.AtLeast<{
    localId?: string
    AND?: PurchaseOrderRecordWhereInput | PurchaseOrderRecordWhereInput[]
    OR?: PurchaseOrderRecordWhereInput[]
    NOT?: PurchaseOrderRecordWhereInput | PurchaseOrderRecordWhereInput[]
    payload?: JsonFilter<"PurchaseOrderRecord">
    createdAt?: DateTimeFilter<"PurchaseOrderRecord"> | Date | string
    updatedAt?: DateTimeFilter<"PurchaseOrderRecord"> | Date | string
  }, "localId">

  export type PurchaseOrderRecordOrderByWithAggregationInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PurchaseOrderRecordCountOrderByAggregateInput
    _max?: PurchaseOrderRecordMaxOrderByAggregateInput
    _min?: PurchaseOrderRecordMinOrderByAggregateInput
  }

  export type PurchaseOrderRecordScalarWhereWithAggregatesInput = {
    AND?: PurchaseOrderRecordScalarWhereWithAggregatesInput | PurchaseOrderRecordScalarWhereWithAggregatesInput[]
    OR?: PurchaseOrderRecordScalarWhereWithAggregatesInput[]
    NOT?: PurchaseOrderRecordScalarWhereWithAggregatesInput | PurchaseOrderRecordScalarWhereWithAggregatesInput[]
    localId?: StringWithAggregatesFilter<"PurchaseOrderRecord"> | string
    payload?: JsonWithAggregatesFilter<"PurchaseOrderRecord">
    createdAt?: DateTimeWithAggregatesFilter<"PurchaseOrderRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PurchaseOrderRecord"> | Date | string
  }

  export type SupplierOrderAcknowledgementRecordWhereInput = {
    AND?: SupplierOrderAcknowledgementRecordWhereInput | SupplierOrderAcknowledgementRecordWhereInput[]
    OR?: SupplierOrderAcknowledgementRecordWhereInput[]
    NOT?: SupplierOrderAcknowledgementRecordWhereInput | SupplierOrderAcknowledgementRecordWhereInput[]
    localId?: StringFilter<"SupplierOrderAcknowledgementRecord"> | string
    payload?: JsonFilter<"SupplierOrderAcknowledgementRecord">
    createdAt?: DateTimeFilter<"SupplierOrderAcknowledgementRecord"> | Date | string
    updatedAt?: DateTimeFilter<"SupplierOrderAcknowledgementRecord"> | Date | string
  }

  export type SupplierOrderAcknowledgementRecordOrderByWithRelationInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierOrderAcknowledgementRecordWhereUniqueInput = Prisma.AtLeast<{
    localId?: string
    AND?: SupplierOrderAcknowledgementRecordWhereInput | SupplierOrderAcknowledgementRecordWhereInput[]
    OR?: SupplierOrderAcknowledgementRecordWhereInput[]
    NOT?: SupplierOrderAcknowledgementRecordWhereInput | SupplierOrderAcknowledgementRecordWhereInput[]
    payload?: JsonFilter<"SupplierOrderAcknowledgementRecord">
    createdAt?: DateTimeFilter<"SupplierOrderAcknowledgementRecord"> | Date | string
    updatedAt?: DateTimeFilter<"SupplierOrderAcknowledgementRecord"> | Date | string
  }, "localId">

  export type SupplierOrderAcknowledgementRecordOrderByWithAggregationInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SupplierOrderAcknowledgementRecordCountOrderByAggregateInput
    _max?: SupplierOrderAcknowledgementRecordMaxOrderByAggregateInput
    _min?: SupplierOrderAcknowledgementRecordMinOrderByAggregateInput
  }

  export type SupplierOrderAcknowledgementRecordScalarWhereWithAggregatesInput = {
    AND?: SupplierOrderAcknowledgementRecordScalarWhereWithAggregatesInput | SupplierOrderAcknowledgementRecordScalarWhereWithAggregatesInput[]
    OR?: SupplierOrderAcknowledgementRecordScalarWhereWithAggregatesInput[]
    NOT?: SupplierOrderAcknowledgementRecordScalarWhereWithAggregatesInput | SupplierOrderAcknowledgementRecordScalarWhereWithAggregatesInput[]
    localId?: StringWithAggregatesFilter<"SupplierOrderAcknowledgementRecord"> | string
    payload?: JsonWithAggregatesFilter<"SupplierOrderAcknowledgementRecord">
    createdAt?: DateTimeWithAggregatesFilter<"SupplierOrderAcknowledgementRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SupplierOrderAcknowledgementRecord"> | Date | string
  }

  export type SupplierDeliveryRecordStoreWhereInput = {
    AND?: SupplierDeliveryRecordStoreWhereInput | SupplierDeliveryRecordStoreWhereInput[]
    OR?: SupplierDeliveryRecordStoreWhereInput[]
    NOT?: SupplierDeliveryRecordStoreWhereInput | SupplierDeliveryRecordStoreWhereInput[]
    localId?: StringFilter<"SupplierDeliveryRecordStore"> | string
    payload?: JsonFilter<"SupplierDeliveryRecordStore">
    createdAt?: DateTimeFilter<"SupplierDeliveryRecordStore"> | Date | string
    updatedAt?: DateTimeFilter<"SupplierDeliveryRecordStore"> | Date | string
  }

  export type SupplierDeliveryRecordStoreOrderByWithRelationInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierDeliveryRecordStoreWhereUniqueInput = Prisma.AtLeast<{
    localId?: string
    AND?: SupplierDeliveryRecordStoreWhereInput | SupplierDeliveryRecordStoreWhereInput[]
    OR?: SupplierDeliveryRecordStoreWhereInput[]
    NOT?: SupplierDeliveryRecordStoreWhereInput | SupplierDeliveryRecordStoreWhereInput[]
    payload?: JsonFilter<"SupplierDeliveryRecordStore">
    createdAt?: DateTimeFilter<"SupplierDeliveryRecordStore"> | Date | string
    updatedAt?: DateTimeFilter<"SupplierDeliveryRecordStore"> | Date | string
  }, "localId">

  export type SupplierDeliveryRecordStoreOrderByWithAggregationInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SupplierDeliveryRecordStoreCountOrderByAggregateInput
    _max?: SupplierDeliveryRecordStoreMaxOrderByAggregateInput
    _min?: SupplierDeliveryRecordStoreMinOrderByAggregateInput
  }

  export type SupplierDeliveryRecordStoreScalarWhereWithAggregatesInput = {
    AND?: SupplierDeliveryRecordStoreScalarWhereWithAggregatesInput | SupplierDeliveryRecordStoreScalarWhereWithAggregatesInput[]
    OR?: SupplierDeliveryRecordStoreScalarWhereWithAggregatesInput[]
    NOT?: SupplierDeliveryRecordStoreScalarWhereWithAggregatesInput | SupplierDeliveryRecordStoreScalarWhereWithAggregatesInput[]
    localId?: StringWithAggregatesFilter<"SupplierDeliveryRecordStore"> | string
    payload?: JsonWithAggregatesFilter<"SupplierDeliveryRecordStore">
    createdAt?: DateTimeWithAggregatesFilter<"SupplierDeliveryRecordStore"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SupplierDeliveryRecordStore"> | Date | string
  }

  export type SupplierGrnRecordStoreWhereInput = {
    AND?: SupplierGrnRecordStoreWhereInput | SupplierGrnRecordStoreWhereInput[]
    OR?: SupplierGrnRecordStoreWhereInput[]
    NOT?: SupplierGrnRecordStoreWhereInput | SupplierGrnRecordStoreWhereInput[]
    localId?: StringFilter<"SupplierGrnRecordStore"> | string
    payload?: JsonFilter<"SupplierGrnRecordStore">
    createdAt?: DateTimeFilter<"SupplierGrnRecordStore"> | Date | string
    updatedAt?: DateTimeFilter<"SupplierGrnRecordStore"> | Date | string
  }

  export type SupplierGrnRecordStoreOrderByWithRelationInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierGrnRecordStoreWhereUniqueInput = Prisma.AtLeast<{
    localId?: string
    AND?: SupplierGrnRecordStoreWhereInput | SupplierGrnRecordStoreWhereInput[]
    OR?: SupplierGrnRecordStoreWhereInput[]
    NOT?: SupplierGrnRecordStoreWhereInput | SupplierGrnRecordStoreWhereInput[]
    payload?: JsonFilter<"SupplierGrnRecordStore">
    createdAt?: DateTimeFilter<"SupplierGrnRecordStore"> | Date | string
    updatedAt?: DateTimeFilter<"SupplierGrnRecordStore"> | Date | string
  }, "localId">

  export type SupplierGrnRecordStoreOrderByWithAggregationInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SupplierGrnRecordStoreCountOrderByAggregateInput
    _max?: SupplierGrnRecordStoreMaxOrderByAggregateInput
    _min?: SupplierGrnRecordStoreMinOrderByAggregateInput
  }

  export type SupplierGrnRecordStoreScalarWhereWithAggregatesInput = {
    AND?: SupplierGrnRecordStoreScalarWhereWithAggregatesInput | SupplierGrnRecordStoreScalarWhereWithAggregatesInput[]
    OR?: SupplierGrnRecordStoreScalarWhereWithAggregatesInput[]
    NOT?: SupplierGrnRecordStoreScalarWhereWithAggregatesInput | SupplierGrnRecordStoreScalarWhereWithAggregatesInput[]
    localId?: StringWithAggregatesFilter<"SupplierGrnRecordStore"> | string
    payload?: JsonWithAggregatesFilter<"SupplierGrnRecordStore">
    createdAt?: DateTimeWithAggregatesFilter<"SupplierGrnRecordStore"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SupplierGrnRecordStore"> | Date | string
  }

  export type ChatSessionWhereInput = {
    AND?: ChatSessionWhereInput | ChatSessionWhereInput[]
    OR?: ChatSessionWhereInput[]
    NOT?: ChatSessionWhereInput | ChatSessionWhereInput[]
    id?: StringFilter<"ChatSession"> | string
    userId?: IntFilter<"ChatSession"> | number
    title?: StringNullableFilter<"ChatSession"> | string | null
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    messages?: ChatMessageListRelationFilter
    sources?: SourceListRelationFilter
  }

  export type ChatSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    messages?: ChatMessageOrderByRelationAggregateInput
    sources?: SourceOrderByRelationAggregateInput
  }

  export type ChatSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatSessionWhereInput | ChatSessionWhereInput[]
    OR?: ChatSessionWhereInput[]
    NOT?: ChatSessionWhereInput | ChatSessionWhereInput[]
    userId?: IntFilter<"ChatSession"> | number
    title?: StringNullableFilter<"ChatSession"> | string | null
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    messages?: ChatMessageListRelationFilter
    sources?: SourceListRelationFilter
  }, "id">

  export type ChatSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChatSessionCountOrderByAggregateInput
    _avg?: ChatSessionAvgOrderByAggregateInput
    _max?: ChatSessionMaxOrderByAggregateInput
    _min?: ChatSessionMinOrderByAggregateInput
    _sum?: ChatSessionSumOrderByAggregateInput
  }

  export type ChatSessionScalarWhereWithAggregatesInput = {
    AND?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    OR?: ChatSessionScalarWhereWithAggregatesInput[]
    NOT?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatSession"> | string
    userId?: IntWithAggregatesFilter<"ChatSession"> | number
    title?: StringNullableWithAggregatesFilter<"ChatSession"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
  }

  export type ChatMessageWhereInput = {
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    id?: IntFilter<"ChatMessage"> | number
    sessionId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    content?: StringFilter<"ChatMessage"> | string
    metadata?: JsonNullableFilter<"ChatMessage">
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    session?: XOR<ChatSessionScalarRelationFilter, ChatSessionWhereInput>
  }

  export type ChatMessageOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    session?: ChatSessionOrderByWithRelationInput
  }

  export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    sessionId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    content?: StringFilter<"ChatMessage"> | string
    metadata?: JsonNullableFilter<"ChatMessage">
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    session?: XOR<ChatSessionScalarRelationFilter, ChatSessionWhereInput>
  }, "id">

  export type ChatMessageOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ChatMessageCountOrderByAggregateInput
    _avg?: ChatMessageAvgOrderByAggregateInput
    _max?: ChatMessageMaxOrderByAggregateInput
    _min?: ChatMessageMinOrderByAggregateInput
    _sum?: ChatMessageSumOrderByAggregateInput
  }

  export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    OR?: ChatMessageScalarWhereWithAggregatesInput[]
    NOT?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ChatMessage"> | number
    sessionId?: StringWithAggregatesFilter<"ChatMessage"> | string
    role?: StringWithAggregatesFilter<"ChatMessage"> | string
    content?: StringWithAggregatesFilter<"ChatMessage"> | string
    metadata?: JsonNullableWithAggregatesFilter<"ChatMessage">
    createdAt?: DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string
  }

  export type SourceWhereInput = {
    AND?: SourceWhereInput | SourceWhereInput[]
    OR?: SourceWhereInput[]
    NOT?: SourceWhereInput | SourceWhereInput[]
    id?: StringFilter<"Source"> | string
    userId?: IntFilter<"Source"> | number
    sessionId?: StringNullableFilter<"Source"> | string | null
    fileName?: StringFilter<"Source"> | string
    filePath?: StringFilter<"Source"> | string
    fileType?: StringFilter<"Source"> | string
    fileSize?: IntFilter<"Source"> | number
    uploadedAt?: DateTimeFilter<"Source"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    session?: XOR<ChatSessionNullableScalarRelationFilter, ChatSessionWhereInput> | null
    chunks?: SourceChunkListRelationFilter
  }

  export type SourceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrderInput | SortOrder
    fileName?: SortOrder
    filePath?: SortOrder
    fileType?: SortOrder
    fileSize?: SortOrder
    uploadedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    session?: ChatSessionOrderByWithRelationInput
    chunks?: SourceChunkOrderByRelationAggregateInput
  }

  export type SourceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SourceWhereInput | SourceWhereInput[]
    OR?: SourceWhereInput[]
    NOT?: SourceWhereInput | SourceWhereInput[]
    userId?: IntFilter<"Source"> | number
    sessionId?: StringNullableFilter<"Source"> | string | null
    fileName?: StringFilter<"Source"> | string
    filePath?: StringFilter<"Source"> | string
    fileType?: StringFilter<"Source"> | string
    fileSize?: IntFilter<"Source"> | number
    uploadedAt?: DateTimeFilter<"Source"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    session?: XOR<ChatSessionNullableScalarRelationFilter, ChatSessionWhereInput> | null
    chunks?: SourceChunkListRelationFilter
  }, "id">

  export type SourceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrderInput | SortOrder
    fileName?: SortOrder
    filePath?: SortOrder
    fileType?: SortOrder
    fileSize?: SortOrder
    uploadedAt?: SortOrder
    _count?: SourceCountOrderByAggregateInput
    _avg?: SourceAvgOrderByAggregateInput
    _max?: SourceMaxOrderByAggregateInput
    _min?: SourceMinOrderByAggregateInput
    _sum?: SourceSumOrderByAggregateInput
  }

  export type SourceScalarWhereWithAggregatesInput = {
    AND?: SourceScalarWhereWithAggregatesInput | SourceScalarWhereWithAggregatesInput[]
    OR?: SourceScalarWhereWithAggregatesInput[]
    NOT?: SourceScalarWhereWithAggregatesInput | SourceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Source"> | string
    userId?: IntWithAggregatesFilter<"Source"> | number
    sessionId?: StringNullableWithAggregatesFilter<"Source"> | string | null
    fileName?: StringWithAggregatesFilter<"Source"> | string
    filePath?: StringWithAggregatesFilter<"Source"> | string
    fileType?: StringWithAggregatesFilter<"Source"> | string
    fileSize?: IntWithAggregatesFilter<"Source"> | number
    uploadedAt?: DateTimeWithAggregatesFilter<"Source"> | Date | string
  }

  export type SourceChunkWhereInput = {
    AND?: SourceChunkWhereInput | SourceChunkWhereInput[]
    OR?: SourceChunkWhereInput[]
    NOT?: SourceChunkWhereInput | SourceChunkWhereInput[]
    id?: StringFilter<"SourceChunk"> | string
    sourceId?: StringFilter<"SourceChunk"> | string
    content?: StringFilter<"SourceChunk"> | string
    chunkIndex?: IntFilter<"SourceChunk"> | number
    source?: XOR<SourceScalarRelationFilter, SourceWhereInput>
  }

  export type SourceChunkOrderByWithRelationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    content?: SortOrder
    chunkIndex?: SortOrder
    source?: SourceOrderByWithRelationInput
  }

  export type SourceChunkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SourceChunkWhereInput | SourceChunkWhereInput[]
    OR?: SourceChunkWhereInput[]
    NOT?: SourceChunkWhereInput | SourceChunkWhereInput[]
    sourceId?: StringFilter<"SourceChunk"> | string
    content?: StringFilter<"SourceChunk"> | string
    chunkIndex?: IntFilter<"SourceChunk"> | number
    source?: XOR<SourceScalarRelationFilter, SourceWhereInput>
  }, "id">

  export type SourceChunkOrderByWithAggregationInput = {
    id?: SortOrder
    sourceId?: SortOrder
    content?: SortOrder
    chunkIndex?: SortOrder
    _count?: SourceChunkCountOrderByAggregateInput
    _avg?: SourceChunkAvgOrderByAggregateInput
    _max?: SourceChunkMaxOrderByAggregateInput
    _min?: SourceChunkMinOrderByAggregateInput
    _sum?: SourceChunkSumOrderByAggregateInput
  }

  export type SourceChunkScalarWhereWithAggregatesInput = {
    AND?: SourceChunkScalarWhereWithAggregatesInput | SourceChunkScalarWhereWithAggregatesInput[]
    OR?: SourceChunkScalarWhereWithAggregatesInput[]
    NOT?: SourceChunkScalarWhereWithAggregatesInput | SourceChunkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SourceChunk"> | string
    sourceId?: StringWithAggregatesFilter<"SourceChunk"> | string
    content?: StringWithAggregatesFilter<"SourceChunk"> | string
    chunkIndex?: IntWithAggregatesFilter<"SourceChunk"> | number
  }

  export type UserCreateInput = {
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditCreateNestedManyWithoutTargetInput
    passwordResetCodes?: PasswordResetCodeCreateNestedManyWithoutUserInput
    supplierTypeAssignments?: SupplierTypeAssignmentCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
    sources?: SourceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedCreateNestedManyWithoutTargetInput
    passwordResetCodes?: PasswordResetCodeUncheckedCreateNestedManyWithoutUserInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    sources?: SourceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUpdateManyWithoutTargetNestedInput
    passwordResetCodes?: PasswordResetCodeUpdateManyWithoutUserNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
    sources?: SourceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedUpdateManyWithoutTargetNestedInput
    passwordResetCodes?: PasswordResetCodeUncheckedUpdateManyWithoutUserNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    sources?: SourceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
  }

  export type UserUpdateManyMutationInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
  }

  export type NotificationCreateInput = {
    title: string
    message: string
    type?: string
    channel?: string
    refType?: string | null
    refId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    readAt?: Date | string | null
    user: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: number
    userId: number
    title: string
    message: string
    type?: string
    channel?: string
    refType?: string | null
    refId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    readAt?: Date | string | null
  }

  export type NotificationUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    refType?: NullableStringFieldUpdateOperationsInput | string | null
    refId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    refType?: NullableStringFieldUpdateOperationsInput | string | null
    refId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NotificationCreateManyInput = {
    id?: number
    userId: number
    title: string
    message: string
    type?: string
    channel?: string
    refType?: string | null
    refId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    readAt?: Date | string | null
  }

  export type NotificationUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    refType?: NullableStringFieldUpdateOperationsInput | string | null
    refId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    refType?: NullableStringFieldUpdateOperationsInput | string | null
    refId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FeedbackCreateInput = {
    type: string
    description: string
    status?: string
    adminComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutFeedbacksInput
  }

  export type FeedbackUncheckedCreateInput = {
    id?: number
    userId: number
    type: string
    description: string
    status?: string
    adminComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeedbackUpdateInput = {
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    adminComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutFeedbacksNestedInput
  }

  export type FeedbackUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    adminComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackCreateManyInput = {
    id?: number
    userId: number
    type: string
    description: string
    status?: string
    adminComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeedbackUpdateManyMutationInput = {
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    adminComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    adminComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleChangeAuditCreateInput = {
    fromRole: string
    toRole: string
    actorEmail: string
    actorName?: string | null
    createdAt?: Date | string
    target: UserCreateNestedOneWithoutRoleChangeAuditsAsTargetInput
  }

  export type RoleChangeAuditUncheckedCreateInput = {
    id?: number
    targetId: number
    fromRole: string
    toRole: string
    actorEmail: string
    actorName?: string | null
    createdAt?: Date | string
  }

  export type RoleChangeAuditUpdateInput = {
    fromRole?: StringFieldUpdateOperationsInput | string
    toRole?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    actorName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    target?: UserUpdateOneRequiredWithoutRoleChangeAuditsAsTargetNestedInput
  }

  export type RoleChangeAuditUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    targetId?: IntFieldUpdateOperationsInput | number
    fromRole?: StringFieldUpdateOperationsInput | string
    toRole?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    actorName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleChangeAuditCreateManyInput = {
    id?: number
    targetId: number
    fromRole: string
    toRole: string
    actorEmail: string
    actorName?: string | null
    createdAt?: Date | string
  }

  export type RoleChangeAuditUpdateManyMutationInput = {
    fromRole?: StringFieldUpdateOperationsInput | string
    toRole?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    actorName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleChangeAuditUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    targetId?: IntFieldUpdateOperationsInput | number
    fromRole?: StringFieldUpdateOperationsInput | string
    toRole?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    actorName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCodeCreateInput = {
    email: string
    codeHash: string
    salt: string
    attempts?: number
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPasswordResetCodesInput
  }

  export type PasswordResetCodeUncheckedCreateInput = {
    id?: number
    userId: number
    email: string
    codeHash: string
    salt: string
    attempts?: number
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetCodeUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    salt?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPasswordResetCodesNestedInput
  }

  export type PasswordResetCodeUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    salt?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCodeCreateManyInput = {
    id?: number
    userId: number
    email: string
    codeHash: string
    salt: string
    attempts?: number
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetCodeUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    salt?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCodeUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    salt?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchasingLookupCreateInput = {
    kind: string
    value: string
    createdAt?: Date | string
  }

  export type PurchasingLookupUncheckedCreateInput = {
    id?: number
    kind: string
    value: string
    createdAt?: Date | string
  }

  export type PurchasingLookupUpdateInput = {
    kind?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchasingLookupUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchasingLookupCreateManyInput = {
    id?: number
    kind: string
    value: string
    createdAt?: Date | string
  }

  export type PurchasingLookupUpdateManyMutationInput = {
    kind?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchasingLookupUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    kind?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierTypeAssignmentCreateInput = {
    category: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSupplierTypeAssignmentsInput
  }

  export type SupplierTypeAssignmentUncheckedCreateInput = {
    id?: number
    userId: number
    category: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierTypeAssignmentUpdateInput = {
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSupplierTypeAssignmentsNestedInput
  }

  export type SupplierTypeAssignmentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierTypeAssignmentCreateManyInput = {
    id?: number
    userId: number
    category: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierTypeAssignmentUpdateManyMutationInput = {
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierTypeAssignmentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseRequestRecordCreateInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseRequestRecordUncheckedCreateInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseRequestRecordUpdateInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseRequestRecordUncheckedUpdateInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseRequestRecordCreateManyInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseRequestRecordUpdateManyMutationInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseRequestRecordUncheckedUpdateManyInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseOrderRecordCreateInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseOrderRecordUncheckedCreateInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseOrderRecordUpdateInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseOrderRecordUncheckedUpdateInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseOrderRecordCreateManyInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PurchaseOrderRecordUpdateManyMutationInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PurchaseOrderRecordUncheckedUpdateManyInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierOrderAcknowledgementRecordCreateInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierOrderAcknowledgementRecordUncheckedCreateInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierOrderAcknowledgementRecordUpdateInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierOrderAcknowledgementRecordUncheckedUpdateInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierOrderAcknowledgementRecordCreateManyInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierOrderAcknowledgementRecordUpdateManyMutationInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierOrderAcknowledgementRecordUncheckedUpdateManyInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierDeliveryRecordStoreCreateInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierDeliveryRecordStoreUncheckedCreateInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierDeliveryRecordStoreUpdateInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierDeliveryRecordStoreUncheckedUpdateInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierDeliveryRecordStoreCreateManyInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierDeliveryRecordStoreUpdateManyMutationInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierDeliveryRecordStoreUncheckedUpdateManyInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierGrnRecordStoreCreateInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierGrnRecordStoreUncheckedCreateInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierGrnRecordStoreUpdateInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierGrnRecordStoreUncheckedUpdateInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierGrnRecordStoreCreateManyInput = {
    localId: string
    payload: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierGrnRecordStoreUpdateManyMutationInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierGrnRecordStoreUncheckedUpdateManyInput = {
    localId?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatSessionCreateInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutChatSessionsInput
    messages?: ChatMessageCreateNestedManyWithoutSessionInput
    sources?: SourceCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateInput = {
    id?: string
    userId: number
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutSessionInput
    sources?: SourceUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
    messages?: ChatMessageUpdateManyWithoutSessionNestedInput
    sources?: SourceUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutSessionNestedInput
    sources?: SourceUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionCreateManyInput = {
    id?: string
    userId: number
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateInput = {
    role: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    session: ChatSessionCreateNestedOneWithoutMessagesInput
  }

  export type ChatMessageUncheckedCreateInput = {
    id?: number
    sessionId: string
    role: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUpdateInput = {
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: ChatSessionUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type ChatMessageUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateManyInput = {
    id?: number
    sessionId: string
    role: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUpdateManyMutationInput = {
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceCreateInput = {
    id?: string
    fileName: string
    filePath: string
    fileType: string
    fileSize: number
    uploadedAt?: Date | string
    user: UserCreateNestedOneWithoutSourcesInput
    session?: ChatSessionCreateNestedOneWithoutSourcesInput
    chunks?: SourceChunkCreateNestedManyWithoutSourceInput
  }

  export type SourceUncheckedCreateInput = {
    id?: string
    userId: number
    sessionId?: string | null
    fileName: string
    filePath: string
    fileType: string
    fileSize: number
    uploadedAt?: Date | string
    chunks?: SourceChunkUncheckedCreateNestedManyWithoutSourceInput
  }

  export type SourceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSourcesNestedInput
    session?: ChatSessionUpdateOneWithoutSourcesNestedInput
    chunks?: SourceChunkUpdateManyWithoutSourceNestedInput
  }

  export type SourceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chunks?: SourceChunkUncheckedUpdateManyWithoutSourceNestedInput
  }

  export type SourceCreateManyInput = {
    id?: string
    userId: number
    sessionId?: string | null
    fileName: string
    filePath: string
    fileType: string
    fileSize: number
    uploadedAt?: Date | string
  }

  export type SourceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceChunkCreateInput = {
    id?: string
    content: string
    chunkIndex: number
    source: SourceCreateNestedOneWithoutChunksInput
  }

  export type SourceChunkUncheckedCreateInput = {
    id?: string
    sourceId: string
    content: string
    chunkIndex: number
  }

  export type SourceChunkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
    source?: SourceUpdateOneRequiredWithoutChunksNestedInput
  }

  export type SourceChunkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
  }

  export type SourceChunkCreateManyInput = {
    id?: string
    sourceId: string
    content: string
    chunkIndex: number
  }

  export type SourceChunkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
  }

  export type SourceChunkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sourceId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumLanguageFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | EnumLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumLanguageFilter<$PrismaModel> | $Enums.Language
  }

  export type RoleChangeAuditListRelationFilter = {
    every?: RoleChangeAuditWhereInput
    some?: RoleChangeAuditWhereInput
    none?: RoleChangeAuditWhereInput
  }

  export type PasswordResetCodeListRelationFilter = {
    every?: PasswordResetCodeWhereInput
    some?: PasswordResetCodeWhereInput
    none?: PasswordResetCodeWhereInput
  }

  export type SupplierTypeAssignmentListRelationFilter = {
    every?: SupplierTypeAssignmentWhereInput
    some?: SupplierTypeAssignmentWhereInput
    none?: SupplierTypeAssignmentWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type FeedbackListRelationFilter = {
    every?: FeedbackWhereInput
    some?: FeedbackWhereInput
    none?: FeedbackWhereInput
  }

  export type ChatSessionListRelationFilter = {
    every?: ChatSessionWhereInput
    some?: ChatSessionWhereInput
    none?: ChatSessionWhereInput
  }

  export type SourceListRelationFilter = {
    every?: SourceWhereInput
    some?: SourceWhereInput
    none?: SourceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RoleChangeAuditOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PasswordResetCodeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SupplierTypeAssignmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FeedbackOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SourceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    department?: SortOrder
    avatarUrl?: SortOrder
    isActive?: SortOrder
    preferredLanguage?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    department?: SortOrder
    avatarUrl?: SortOrder
    isActive?: SortOrder
    preferredLanguage?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    department?: SortOrder
    avatarUrl?: SortOrder
    isActive?: SortOrder
    preferredLanguage?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumLanguageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | EnumLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumLanguageWithAggregatesFilter<$PrismaModel> | $Enums.Language
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLanguageFilter<$PrismaModel>
    _max?: NestedEnumLanguageFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    channel?: SortOrder
    refType?: SortOrder
    refId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrder
  }

  export type NotificationAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    channel?: SortOrder
    refType?: SortOrder
    refId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    channel?: SortOrder
    refType?: SortOrder
    refId?: SortOrder
    isRead?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrder
  }

  export type NotificationSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FeedbackCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    status?: SortOrder
    adminComment?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeedbackAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type FeedbackMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    status?: SortOrder
    adminComment?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeedbackMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    status?: SortOrder
    adminComment?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeedbackSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type RoleChangeAuditCountOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
    fromRole?: SortOrder
    toRole?: SortOrder
    actorEmail?: SortOrder
    actorName?: SortOrder
    createdAt?: SortOrder
  }

  export type RoleChangeAuditAvgOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
  }

  export type RoleChangeAuditMaxOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
    fromRole?: SortOrder
    toRole?: SortOrder
    actorEmail?: SortOrder
    actorName?: SortOrder
    createdAt?: SortOrder
  }

  export type RoleChangeAuditMinOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
    fromRole?: SortOrder
    toRole?: SortOrder
    actorEmail?: SortOrder
    actorName?: SortOrder
    createdAt?: SortOrder
  }

  export type RoleChangeAuditSumOrderByAggregateInput = {
    id?: SortOrder
    targetId?: SortOrder
  }

  export type PasswordResetCodeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    codeHash?: SortOrder
    salt?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetCodeAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    attempts?: SortOrder
  }

  export type PasswordResetCodeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    codeHash?: SortOrder
    salt?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetCodeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    codeHash?: SortOrder
    salt?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    usedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PasswordResetCodeSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    attempts?: SortOrder
  }

  export type PurchasingLookupKindValueCompoundUniqueInput = {
    kind: string
    value: string
  }

  export type PurchasingLookupCountOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type PurchasingLookupAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PurchasingLookupMaxOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type PurchasingLookupMinOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type PurchasingLookupSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SupplierTypeAssignmentUserIdCategoryCompoundUniqueInput = {
    userId: number
    category: string
  }

  export type SupplierTypeAssignmentCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierTypeAssignmentAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type SupplierTypeAssignmentMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierTypeAssignmentMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierTypeAssignmentSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PurchaseRequestRecordCountOrderByAggregateInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseRequestRecordMaxOrderByAggregateInput = {
    localId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseRequestRecordMinOrderByAggregateInput = {
    localId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type PurchaseOrderRecordCountOrderByAggregateInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseOrderRecordMaxOrderByAggregateInput = {
    localId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PurchaseOrderRecordMinOrderByAggregateInput = {
    localId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierOrderAcknowledgementRecordCountOrderByAggregateInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierOrderAcknowledgementRecordMaxOrderByAggregateInput = {
    localId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierOrderAcknowledgementRecordMinOrderByAggregateInput = {
    localId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierDeliveryRecordStoreCountOrderByAggregateInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierDeliveryRecordStoreMaxOrderByAggregateInput = {
    localId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierDeliveryRecordStoreMinOrderByAggregateInput = {
    localId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierGrnRecordStoreCountOrderByAggregateInput = {
    localId?: SortOrder
    payload?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierGrnRecordStoreMaxOrderByAggregateInput = {
    localId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SupplierGrnRecordStoreMinOrderByAggregateInput = {
    localId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatMessageListRelationFilter = {
    every?: ChatMessageWhereInput
    some?: ChatMessageWhereInput
    none?: ChatMessageWhereInput
  }

  export type ChatMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatSessionAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type ChatSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatSessionSumOrderByAggregateInput = {
    userId?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ChatSessionScalarRelationFilter = {
    is?: ChatSessionWhereInput
    isNot?: ChatSessionWhereInput
  }

  export type ChatMessageCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ChatMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageSumOrderByAggregateInput = {
    id?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ChatSessionNullableScalarRelationFilter = {
    is?: ChatSessionWhereInput | null
    isNot?: ChatSessionWhereInput | null
  }

  export type SourceChunkListRelationFilter = {
    every?: SourceChunkWhereInput
    some?: SourceChunkWhereInput
    none?: SourceChunkWhereInput
  }

  export type SourceChunkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SourceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    fileName?: SortOrder
    filePath?: SortOrder
    fileType?: SortOrder
    fileSize?: SortOrder
    uploadedAt?: SortOrder
  }

  export type SourceAvgOrderByAggregateInput = {
    userId?: SortOrder
    fileSize?: SortOrder
  }

  export type SourceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    fileName?: SortOrder
    filePath?: SortOrder
    fileType?: SortOrder
    fileSize?: SortOrder
    uploadedAt?: SortOrder
  }

  export type SourceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    fileName?: SortOrder
    filePath?: SortOrder
    fileType?: SortOrder
    fileSize?: SortOrder
    uploadedAt?: SortOrder
  }

  export type SourceSumOrderByAggregateInput = {
    userId?: SortOrder
    fileSize?: SortOrder
  }

  export type SourceScalarRelationFilter = {
    is?: SourceWhereInput
    isNot?: SourceWhereInput
  }

  export type SourceChunkCountOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    content?: SortOrder
    chunkIndex?: SortOrder
  }

  export type SourceChunkAvgOrderByAggregateInput = {
    chunkIndex?: SortOrder
  }

  export type SourceChunkMaxOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    content?: SortOrder
    chunkIndex?: SortOrder
  }

  export type SourceChunkMinOrderByAggregateInput = {
    id?: SortOrder
    sourceId?: SortOrder
    content?: SortOrder
    chunkIndex?: SortOrder
  }

  export type SourceChunkSumOrderByAggregateInput = {
    chunkIndex?: SortOrder
  }

  export type RoleChangeAuditCreateNestedManyWithoutTargetInput = {
    create?: XOR<RoleChangeAuditCreateWithoutTargetInput, RoleChangeAuditUncheckedCreateWithoutTargetInput> | RoleChangeAuditCreateWithoutTargetInput[] | RoleChangeAuditUncheckedCreateWithoutTargetInput[]
    connectOrCreate?: RoleChangeAuditCreateOrConnectWithoutTargetInput | RoleChangeAuditCreateOrConnectWithoutTargetInput[]
    createMany?: RoleChangeAuditCreateManyTargetInputEnvelope
    connect?: RoleChangeAuditWhereUniqueInput | RoleChangeAuditWhereUniqueInput[]
  }

  export type PasswordResetCodeCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetCodeCreateWithoutUserInput, PasswordResetCodeUncheckedCreateWithoutUserInput> | PasswordResetCodeCreateWithoutUserInput[] | PasswordResetCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetCodeCreateOrConnectWithoutUserInput | PasswordResetCodeCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetCodeCreateManyUserInputEnvelope
    connect?: PasswordResetCodeWhereUniqueInput | PasswordResetCodeWhereUniqueInput[]
  }

  export type SupplierTypeAssignmentCreateNestedManyWithoutUserInput = {
    create?: XOR<SupplierTypeAssignmentCreateWithoutUserInput, SupplierTypeAssignmentUncheckedCreateWithoutUserInput> | SupplierTypeAssignmentCreateWithoutUserInput[] | SupplierTypeAssignmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SupplierTypeAssignmentCreateOrConnectWithoutUserInput | SupplierTypeAssignmentCreateOrConnectWithoutUserInput[]
    createMany?: SupplierTypeAssignmentCreateManyUserInputEnvelope
    connect?: SupplierTypeAssignmentWhereUniqueInput | SupplierTypeAssignmentWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type FeedbackCreateNestedManyWithoutUserInput = {
    create?: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput> | FeedbackCreateWithoutUserInput[] | FeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutUserInput | FeedbackCreateOrConnectWithoutUserInput[]
    createMany?: FeedbackCreateManyUserInputEnvelope
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
  }

  export type ChatSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type SourceCreateNestedManyWithoutUserInput = {
    create?: XOR<SourceCreateWithoutUserInput, SourceUncheckedCreateWithoutUserInput> | SourceCreateWithoutUserInput[] | SourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SourceCreateOrConnectWithoutUserInput | SourceCreateOrConnectWithoutUserInput[]
    createMany?: SourceCreateManyUserInputEnvelope
    connect?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
  }

  export type RoleChangeAuditUncheckedCreateNestedManyWithoutTargetInput = {
    create?: XOR<RoleChangeAuditCreateWithoutTargetInput, RoleChangeAuditUncheckedCreateWithoutTargetInput> | RoleChangeAuditCreateWithoutTargetInput[] | RoleChangeAuditUncheckedCreateWithoutTargetInput[]
    connectOrCreate?: RoleChangeAuditCreateOrConnectWithoutTargetInput | RoleChangeAuditCreateOrConnectWithoutTargetInput[]
    createMany?: RoleChangeAuditCreateManyTargetInputEnvelope
    connect?: RoleChangeAuditWhereUniqueInput | RoleChangeAuditWhereUniqueInput[]
  }

  export type PasswordResetCodeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetCodeCreateWithoutUserInput, PasswordResetCodeUncheckedCreateWithoutUserInput> | PasswordResetCodeCreateWithoutUserInput[] | PasswordResetCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetCodeCreateOrConnectWithoutUserInput | PasswordResetCodeCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetCodeCreateManyUserInputEnvelope
    connect?: PasswordResetCodeWhereUniqueInput | PasswordResetCodeWhereUniqueInput[]
  }

  export type SupplierTypeAssignmentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SupplierTypeAssignmentCreateWithoutUserInput, SupplierTypeAssignmentUncheckedCreateWithoutUserInput> | SupplierTypeAssignmentCreateWithoutUserInput[] | SupplierTypeAssignmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SupplierTypeAssignmentCreateOrConnectWithoutUserInput | SupplierTypeAssignmentCreateOrConnectWithoutUserInput[]
    createMany?: SupplierTypeAssignmentCreateManyUserInputEnvelope
    connect?: SupplierTypeAssignmentWhereUniqueInput | SupplierTypeAssignmentWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type FeedbackUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput> | FeedbackCreateWithoutUserInput[] | FeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutUserInput | FeedbackCreateOrConnectWithoutUserInput[]
    createMany?: FeedbackCreateManyUserInputEnvelope
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
  }

  export type ChatSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type SourceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SourceCreateWithoutUserInput, SourceUncheckedCreateWithoutUserInput> | SourceCreateWithoutUserInput[] | SourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SourceCreateOrConnectWithoutUserInput | SourceCreateOrConnectWithoutUserInput[]
    createMany?: SourceCreateManyUserInputEnvelope
    connect?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumLanguageFieldUpdateOperationsInput = {
    set?: $Enums.Language
  }

  export type RoleChangeAuditUpdateManyWithoutTargetNestedInput = {
    create?: XOR<RoleChangeAuditCreateWithoutTargetInput, RoleChangeAuditUncheckedCreateWithoutTargetInput> | RoleChangeAuditCreateWithoutTargetInput[] | RoleChangeAuditUncheckedCreateWithoutTargetInput[]
    connectOrCreate?: RoleChangeAuditCreateOrConnectWithoutTargetInput | RoleChangeAuditCreateOrConnectWithoutTargetInput[]
    upsert?: RoleChangeAuditUpsertWithWhereUniqueWithoutTargetInput | RoleChangeAuditUpsertWithWhereUniqueWithoutTargetInput[]
    createMany?: RoleChangeAuditCreateManyTargetInputEnvelope
    set?: RoleChangeAuditWhereUniqueInput | RoleChangeAuditWhereUniqueInput[]
    disconnect?: RoleChangeAuditWhereUniqueInput | RoleChangeAuditWhereUniqueInput[]
    delete?: RoleChangeAuditWhereUniqueInput | RoleChangeAuditWhereUniqueInput[]
    connect?: RoleChangeAuditWhereUniqueInput | RoleChangeAuditWhereUniqueInput[]
    update?: RoleChangeAuditUpdateWithWhereUniqueWithoutTargetInput | RoleChangeAuditUpdateWithWhereUniqueWithoutTargetInput[]
    updateMany?: RoleChangeAuditUpdateManyWithWhereWithoutTargetInput | RoleChangeAuditUpdateManyWithWhereWithoutTargetInput[]
    deleteMany?: RoleChangeAuditScalarWhereInput | RoleChangeAuditScalarWhereInput[]
  }

  export type PasswordResetCodeUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetCodeCreateWithoutUserInput, PasswordResetCodeUncheckedCreateWithoutUserInput> | PasswordResetCodeCreateWithoutUserInput[] | PasswordResetCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetCodeCreateOrConnectWithoutUserInput | PasswordResetCodeCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetCodeUpsertWithWhereUniqueWithoutUserInput | PasswordResetCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetCodeCreateManyUserInputEnvelope
    set?: PasswordResetCodeWhereUniqueInput | PasswordResetCodeWhereUniqueInput[]
    disconnect?: PasswordResetCodeWhereUniqueInput | PasswordResetCodeWhereUniqueInput[]
    delete?: PasswordResetCodeWhereUniqueInput | PasswordResetCodeWhereUniqueInput[]
    connect?: PasswordResetCodeWhereUniqueInput | PasswordResetCodeWhereUniqueInput[]
    update?: PasswordResetCodeUpdateWithWhereUniqueWithoutUserInput | PasswordResetCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetCodeUpdateManyWithWhereWithoutUserInput | PasswordResetCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetCodeScalarWhereInput | PasswordResetCodeScalarWhereInput[]
  }

  export type SupplierTypeAssignmentUpdateManyWithoutUserNestedInput = {
    create?: XOR<SupplierTypeAssignmentCreateWithoutUserInput, SupplierTypeAssignmentUncheckedCreateWithoutUserInput> | SupplierTypeAssignmentCreateWithoutUserInput[] | SupplierTypeAssignmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SupplierTypeAssignmentCreateOrConnectWithoutUserInput | SupplierTypeAssignmentCreateOrConnectWithoutUserInput[]
    upsert?: SupplierTypeAssignmentUpsertWithWhereUniqueWithoutUserInput | SupplierTypeAssignmentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SupplierTypeAssignmentCreateManyUserInputEnvelope
    set?: SupplierTypeAssignmentWhereUniqueInput | SupplierTypeAssignmentWhereUniqueInput[]
    disconnect?: SupplierTypeAssignmentWhereUniqueInput | SupplierTypeAssignmentWhereUniqueInput[]
    delete?: SupplierTypeAssignmentWhereUniqueInput | SupplierTypeAssignmentWhereUniqueInput[]
    connect?: SupplierTypeAssignmentWhereUniqueInput | SupplierTypeAssignmentWhereUniqueInput[]
    update?: SupplierTypeAssignmentUpdateWithWhereUniqueWithoutUserInput | SupplierTypeAssignmentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SupplierTypeAssignmentUpdateManyWithWhereWithoutUserInput | SupplierTypeAssignmentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SupplierTypeAssignmentScalarWhereInput | SupplierTypeAssignmentScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type FeedbackUpdateManyWithoutUserNestedInput = {
    create?: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput> | FeedbackCreateWithoutUserInput[] | FeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutUserInput | FeedbackCreateOrConnectWithoutUserInput[]
    upsert?: FeedbackUpsertWithWhereUniqueWithoutUserInput | FeedbackUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FeedbackCreateManyUserInputEnvelope
    set?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    disconnect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    delete?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    update?: FeedbackUpdateWithWhereUniqueWithoutUserInput | FeedbackUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FeedbackUpdateManyWithWhereWithoutUserInput | FeedbackUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
  }

  export type ChatSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutUserInput | ChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutUserInput | ChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutUserInput | ChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type SourceUpdateManyWithoutUserNestedInput = {
    create?: XOR<SourceCreateWithoutUserInput, SourceUncheckedCreateWithoutUserInput> | SourceCreateWithoutUserInput[] | SourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SourceCreateOrConnectWithoutUserInput | SourceCreateOrConnectWithoutUserInput[]
    upsert?: SourceUpsertWithWhereUniqueWithoutUserInput | SourceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SourceCreateManyUserInputEnvelope
    set?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    disconnect?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    delete?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    connect?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    update?: SourceUpdateWithWhereUniqueWithoutUserInput | SourceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SourceUpdateManyWithWhereWithoutUserInput | SourceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SourceScalarWhereInput | SourceScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type RoleChangeAuditUncheckedUpdateManyWithoutTargetNestedInput = {
    create?: XOR<RoleChangeAuditCreateWithoutTargetInput, RoleChangeAuditUncheckedCreateWithoutTargetInput> | RoleChangeAuditCreateWithoutTargetInput[] | RoleChangeAuditUncheckedCreateWithoutTargetInput[]
    connectOrCreate?: RoleChangeAuditCreateOrConnectWithoutTargetInput | RoleChangeAuditCreateOrConnectWithoutTargetInput[]
    upsert?: RoleChangeAuditUpsertWithWhereUniqueWithoutTargetInput | RoleChangeAuditUpsertWithWhereUniqueWithoutTargetInput[]
    createMany?: RoleChangeAuditCreateManyTargetInputEnvelope
    set?: RoleChangeAuditWhereUniqueInput | RoleChangeAuditWhereUniqueInput[]
    disconnect?: RoleChangeAuditWhereUniqueInput | RoleChangeAuditWhereUniqueInput[]
    delete?: RoleChangeAuditWhereUniqueInput | RoleChangeAuditWhereUniqueInput[]
    connect?: RoleChangeAuditWhereUniqueInput | RoleChangeAuditWhereUniqueInput[]
    update?: RoleChangeAuditUpdateWithWhereUniqueWithoutTargetInput | RoleChangeAuditUpdateWithWhereUniqueWithoutTargetInput[]
    updateMany?: RoleChangeAuditUpdateManyWithWhereWithoutTargetInput | RoleChangeAuditUpdateManyWithWhereWithoutTargetInput[]
    deleteMany?: RoleChangeAuditScalarWhereInput | RoleChangeAuditScalarWhereInput[]
  }

  export type PasswordResetCodeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetCodeCreateWithoutUserInput, PasswordResetCodeUncheckedCreateWithoutUserInput> | PasswordResetCodeCreateWithoutUserInput[] | PasswordResetCodeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetCodeCreateOrConnectWithoutUserInput | PasswordResetCodeCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetCodeUpsertWithWhereUniqueWithoutUserInput | PasswordResetCodeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetCodeCreateManyUserInputEnvelope
    set?: PasswordResetCodeWhereUniqueInput | PasswordResetCodeWhereUniqueInput[]
    disconnect?: PasswordResetCodeWhereUniqueInput | PasswordResetCodeWhereUniqueInput[]
    delete?: PasswordResetCodeWhereUniqueInput | PasswordResetCodeWhereUniqueInput[]
    connect?: PasswordResetCodeWhereUniqueInput | PasswordResetCodeWhereUniqueInput[]
    update?: PasswordResetCodeUpdateWithWhereUniqueWithoutUserInput | PasswordResetCodeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetCodeUpdateManyWithWhereWithoutUserInput | PasswordResetCodeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetCodeScalarWhereInput | PasswordResetCodeScalarWhereInput[]
  }

  export type SupplierTypeAssignmentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SupplierTypeAssignmentCreateWithoutUserInput, SupplierTypeAssignmentUncheckedCreateWithoutUserInput> | SupplierTypeAssignmentCreateWithoutUserInput[] | SupplierTypeAssignmentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SupplierTypeAssignmentCreateOrConnectWithoutUserInput | SupplierTypeAssignmentCreateOrConnectWithoutUserInput[]
    upsert?: SupplierTypeAssignmentUpsertWithWhereUniqueWithoutUserInput | SupplierTypeAssignmentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SupplierTypeAssignmentCreateManyUserInputEnvelope
    set?: SupplierTypeAssignmentWhereUniqueInput | SupplierTypeAssignmentWhereUniqueInput[]
    disconnect?: SupplierTypeAssignmentWhereUniqueInput | SupplierTypeAssignmentWhereUniqueInput[]
    delete?: SupplierTypeAssignmentWhereUniqueInput | SupplierTypeAssignmentWhereUniqueInput[]
    connect?: SupplierTypeAssignmentWhereUniqueInput | SupplierTypeAssignmentWhereUniqueInput[]
    update?: SupplierTypeAssignmentUpdateWithWhereUniqueWithoutUserInput | SupplierTypeAssignmentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SupplierTypeAssignmentUpdateManyWithWhereWithoutUserInput | SupplierTypeAssignmentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SupplierTypeAssignmentScalarWhereInput | SupplierTypeAssignmentScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type FeedbackUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput> | FeedbackCreateWithoutUserInput[] | FeedbackUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FeedbackCreateOrConnectWithoutUserInput | FeedbackCreateOrConnectWithoutUserInput[]
    upsert?: FeedbackUpsertWithWhereUniqueWithoutUserInput | FeedbackUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FeedbackCreateManyUserInputEnvelope
    set?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    disconnect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    delete?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    connect?: FeedbackWhereUniqueInput | FeedbackWhereUniqueInput[]
    update?: FeedbackUpdateWithWhereUniqueWithoutUserInput | FeedbackUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FeedbackUpdateManyWithWhereWithoutUserInput | FeedbackUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
  }

  export type ChatSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutUserInput | ChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutUserInput | ChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutUserInput | ChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type SourceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SourceCreateWithoutUserInput, SourceUncheckedCreateWithoutUserInput> | SourceCreateWithoutUserInput[] | SourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SourceCreateOrConnectWithoutUserInput | SourceCreateOrConnectWithoutUserInput[]
    upsert?: SourceUpsertWithWhereUniqueWithoutUserInput | SourceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SourceCreateManyUserInputEnvelope
    set?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    disconnect?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    delete?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    connect?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    update?: SourceUpdateWithWhereUniqueWithoutUserInput | SourceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SourceUpdateManyWithWhereWithoutUserInput | SourceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SourceScalarWhereInput | SourceScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserCreateNestedOneWithoutFeedbacksInput = {
    create?: XOR<UserCreateWithoutFeedbacksInput, UserUncheckedCreateWithoutFeedbacksInput>
    connectOrCreate?: UserCreateOrConnectWithoutFeedbacksInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutFeedbacksNestedInput = {
    create?: XOR<UserCreateWithoutFeedbacksInput, UserUncheckedCreateWithoutFeedbacksInput>
    connectOrCreate?: UserCreateOrConnectWithoutFeedbacksInput
    upsert?: UserUpsertWithoutFeedbacksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutFeedbacksInput, UserUpdateWithoutFeedbacksInput>, UserUncheckedUpdateWithoutFeedbacksInput>
  }

  export type UserCreateNestedOneWithoutRoleChangeAuditsAsTargetInput = {
    create?: XOR<UserCreateWithoutRoleChangeAuditsAsTargetInput, UserUncheckedCreateWithoutRoleChangeAuditsAsTargetInput>
    connectOrCreate?: UserCreateOrConnectWithoutRoleChangeAuditsAsTargetInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutRoleChangeAuditsAsTargetNestedInput = {
    create?: XOR<UserCreateWithoutRoleChangeAuditsAsTargetInput, UserUncheckedCreateWithoutRoleChangeAuditsAsTargetInput>
    connectOrCreate?: UserCreateOrConnectWithoutRoleChangeAuditsAsTargetInput
    upsert?: UserUpsertWithoutRoleChangeAuditsAsTargetInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRoleChangeAuditsAsTargetInput, UserUpdateWithoutRoleChangeAuditsAsTargetInput>, UserUncheckedUpdateWithoutRoleChangeAuditsAsTargetInput>
  }

  export type UserCreateNestedOneWithoutPasswordResetCodesInput = {
    create?: XOR<UserCreateWithoutPasswordResetCodesInput, UserUncheckedCreateWithoutPasswordResetCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPasswordResetCodesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPasswordResetCodesNestedInput = {
    create?: XOR<UserCreateWithoutPasswordResetCodesInput, UserUncheckedCreateWithoutPasswordResetCodesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPasswordResetCodesInput
    upsert?: UserUpsertWithoutPasswordResetCodesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPasswordResetCodesInput, UserUpdateWithoutPasswordResetCodesInput>, UserUncheckedUpdateWithoutPasswordResetCodesInput>
  }

  export type UserCreateNestedOneWithoutSupplierTypeAssignmentsInput = {
    create?: XOR<UserCreateWithoutSupplierTypeAssignmentsInput, UserUncheckedCreateWithoutSupplierTypeAssignmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSupplierTypeAssignmentsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSupplierTypeAssignmentsNestedInput = {
    create?: XOR<UserCreateWithoutSupplierTypeAssignmentsInput, UserUncheckedCreateWithoutSupplierTypeAssignmentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSupplierTypeAssignmentsInput
    upsert?: UserUpsertWithoutSupplierTypeAssignmentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSupplierTypeAssignmentsInput, UserUpdateWithoutSupplierTypeAssignmentsInput>, UserUncheckedUpdateWithoutSupplierTypeAssignmentsInput>
  }

  export type UserCreateNestedOneWithoutChatSessionsInput = {
    create?: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type ChatMessageCreateNestedManyWithoutSessionInput = {
    create?: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput> | ChatMessageCreateWithoutSessionInput[] | ChatMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSessionInput | ChatMessageCreateOrConnectWithoutSessionInput[]
    createMany?: ChatMessageCreateManySessionInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type SourceCreateNestedManyWithoutSessionInput = {
    create?: XOR<SourceCreateWithoutSessionInput, SourceUncheckedCreateWithoutSessionInput> | SourceCreateWithoutSessionInput[] | SourceUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: SourceCreateOrConnectWithoutSessionInput | SourceCreateOrConnectWithoutSessionInput[]
    createMany?: SourceCreateManySessionInputEnvelope
    connect?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
  }

  export type ChatMessageUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput> | ChatMessageCreateWithoutSessionInput[] | ChatMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSessionInput | ChatMessageCreateOrConnectWithoutSessionInput[]
    createMany?: ChatMessageCreateManySessionInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type SourceUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<SourceCreateWithoutSessionInput, SourceUncheckedCreateWithoutSessionInput> | SourceCreateWithoutSessionInput[] | SourceUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: SourceCreateOrConnectWithoutSessionInput | SourceCreateOrConnectWithoutSessionInput[]
    createMany?: SourceCreateManySessionInputEnvelope
    connect?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutChatSessionsNestedInput = {
    create?: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatSessionsInput
    upsert?: UserUpsertWithoutChatSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChatSessionsInput, UserUpdateWithoutChatSessionsInput>, UserUncheckedUpdateWithoutChatSessionsInput>
  }

  export type ChatMessageUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput> | ChatMessageCreateWithoutSessionInput[] | ChatMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSessionInput | ChatMessageCreateOrConnectWithoutSessionInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutSessionInput | ChatMessageUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ChatMessageCreateManySessionInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutSessionInput | ChatMessageUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutSessionInput | ChatMessageUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type SourceUpdateManyWithoutSessionNestedInput = {
    create?: XOR<SourceCreateWithoutSessionInput, SourceUncheckedCreateWithoutSessionInput> | SourceCreateWithoutSessionInput[] | SourceUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: SourceCreateOrConnectWithoutSessionInput | SourceCreateOrConnectWithoutSessionInput[]
    upsert?: SourceUpsertWithWhereUniqueWithoutSessionInput | SourceUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: SourceCreateManySessionInputEnvelope
    set?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    disconnect?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    delete?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    connect?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    update?: SourceUpdateWithWhereUniqueWithoutSessionInput | SourceUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: SourceUpdateManyWithWhereWithoutSessionInput | SourceUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: SourceScalarWhereInput | SourceScalarWhereInput[]
  }

  export type ChatMessageUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput> | ChatMessageCreateWithoutSessionInput[] | ChatMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSessionInput | ChatMessageCreateOrConnectWithoutSessionInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutSessionInput | ChatMessageUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ChatMessageCreateManySessionInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutSessionInput | ChatMessageUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutSessionInput | ChatMessageUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type SourceUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<SourceCreateWithoutSessionInput, SourceUncheckedCreateWithoutSessionInput> | SourceCreateWithoutSessionInput[] | SourceUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: SourceCreateOrConnectWithoutSessionInput | SourceCreateOrConnectWithoutSessionInput[]
    upsert?: SourceUpsertWithWhereUniqueWithoutSessionInput | SourceUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: SourceCreateManySessionInputEnvelope
    set?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    disconnect?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    delete?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    connect?: SourceWhereUniqueInput | SourceWhereUniqueInput[]
    update?: SourceUpdateWithWhereUniqueWithoutSessionInput | SourceUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: SourceUpdateManyWithWhereWithoutSessionInput | SourceUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: SourceScalarWhereInput | SourceScalarWhereInput[]
  }

  export type ChatSessionCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutMessagesInput
    connect?: ChatSessionWhereUniqueInput
  }

  export type ChatSessionUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutMessagesInput
    upsert?: ChatSessionUpsertWithoutMessagesInput
    connect?: ChatSessionWhereUniqueInput
    update?: XOR<XOR<ChatSessionUpdateToOneWithWhereWithoutMessagesInput, ChatSessionUpdateWithoutMessagesInput>, ChatSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type UserCreateNestedOneWithoutSourcesInput = {
    create?: XOR<UserCreateWithoutSourcesInput, UserUncheckedCreateWithoutSourcesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSourcesInput
    connect?: UserWhereUniqueInput
  }

  export type ChatSessionCreateNestedOneWithoutSourcesInput = {
    create?: XOR<ChatSessionCreateWithoutSourcesInput, ChatSessionUncheckedCreateWithoutSourcesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutSourcesInput
    connect?: ChatSessionWhereUniqueInput
  }

  export type SourceChunkCreateNestedManyWithoutSourceInput = {
    create?: XOR<SourceChunkCreateWithoutSourceInput, SourceChunkUncheckedCreateWithoutSourceInput> | SourceChunkCreateWithoutSourceInput[] | SourceChunkUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: SourceChunkCreateOrConnectWithoutSourceInput | SourceChunkCreateOrConnectWithoutSourceInput[]
    createMany?: SourceChunkCreateManySourceInputEnvelope
    connect?: SourceChunkWhereUniqueInput | SourceChunkWhereUniqueInput[]
  }

  export type SourceChunkUncheckedCreateNestedManyWithoutSourceInput = {
    create?: XOR<SourceChunkCreateWithoutSourceInput, SourceChunkUncheckedCreateWithoutSourceInput> | SourceChunkCreateWithoutSourceInput[] | SourceChunkUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: SourceChunkCreateOrConnectWithoutSourceInput | SourceChunkCreateOrConnectWithoutSourceInput[]
    createMany?: SourceChunkCreateManySourceInputEnvelope
    connect?: SourceChunkWhereUniqueInput | SourceChunkWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutSourcesNestedInput = {
    create?: XOR<UserCreateWithoutSourcesInput, UserUncheckedCreateWithoutSourcesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSourcesInput
    upsert?: UserUpsertWithoutSourcesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSourcesInput, UserUpdateWithoutSourcesInput>, UserUncheckedUpdateWithoutSourcesInput>
  }

  export type ChatSessionUpdateOneWithoutSourcesNestedInput = {
    create?: XOR<ChatSessionCreateWithoutSourcesInput, ChatSessionUncheckedCreateWithoutSourcesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutSourcesInput
    upsert?: ChatSessionUpsertWithoutSourcesInput
    disconnect?: ChatSessionWhereInput | boolean
    delete?: ChatSessionWhereInput | boolean
    connect?: ChatSessionWhereUniqueInput
    update?: XOR<XOR<ChatSessionUpdateToOneWithWhereWithoutSourcesInput, ChatSessionUpdateWithoutSourcesInput>, ChatSessionUncheckedUpdateWithoutSourcesInput>
  }

  export type SourceChunkUpdateManyWithoutSourceNestedInput = {
    create?: XOR<SourceChunkCreateWithoutSourceInput, SourceChunkUncheckedCreateWithoutSourceInput> | SourceChunkCreateWithoutSourceInput[] | SourceChunkUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: SourceChunkCreateOrConnectWithoutSourceInput | SourceChunkCreateOrConnectWithoutSourceInput[]
    upsert?: SourceChunkUpsertWithWhereUniqueWithoutSourceInput | SourceChunkUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: SourceChunkCreateManySourceInputEnvelope
    set?: SourceChunkWhereUniqueInput | SourceChunkWhereUniqueInput[]
    disconnect?: SourceChunkWhereUniqueInput | SourceChunkWhereUniqueInput[]
    delete?: SourceChunkWhereUniqueInput | SourceChunkWhereUniqueInput[]
    connect?: SourceChunkWhereUniqueInput | SourceChunkWhereUniqueInput[]
    update?: SourceChunkUpdateWithWhereUniqueWithoutSourceInput | SourceChunkUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: SourceChunkUpdateManyWithWhereWithoutSourceInput | SourceChunkUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: SourceChunkScalarWhereInput | SourceChunkScalarWhereInput[]
  }

  export type SourceChunkUncheckedUpdateManyWithoutSourceNestedInput = {
    create?: XOR<SourceChunkCreateWithoutSourceInput, SourceChunkUncheckedCreateWithoutSourceInput> | SourceChunkCreateWithoutSourceInput[] | SourceChunkUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: SourceChunkCreateOrConnectWithoutSourceInput | SourceChunkCreateOrConnectWithoutSourceInput[]
    upsert?: SourceChunkUpsertWithWhereUniqueWithoutSourceInput | SourceChunkUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: SourceChunkCreateManySourceInputEnvelope
    set?: SourceChunkWhereUniqueInput | SourceChunkWhereUniqueInput[]
    disconnect?: SourceChunkWhereUniqueInput | SourceChunkWhereUniqueInput[]
    delete?: SourceChunkWhereUniqueInput | SourceChunkWhereUniqueInput[]
    connect?: SourceChunkWhereUniqueInput | SourceChunkWhereUniqueInput[]
    update?: SourceChunkUpdateWithWhereUniqueWithoutSourceInput | SourceChunkUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: SourceChunkUpdateManyWithWhereWithoutSourceInput | SourceChunkUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: SourceChunkScalarWhereInput | SourceChunkScalarWhereInput[]
  }

  export type SourceCreateNestedOneWithoutChunksInput = {
    create?: XOR<SourceCreateWithoutChunksInput, SourceUncheckedCreateWithoutChunksInput>
    connectOrCreate?: SourceCreateOrConnectWithoutChunksInput
    connect?: SourceWhereUniqueInput
  }

  export type SourceUpdateOneRequiredWithoutChunksNestedInput = {
    create?: XOR<SourceCreateWithoutChunksInput, SourceUncheckedCreateWithoutChunksInput>
    connectOrCreate?: SourceCreateOrConnectWithoutChunksInput
    upsert?: SourceUpsertWithoutChunksInput
    connect?: SourceWhereUniqueInput
    update?: XOR<XOR<SourceUpdateToOneWithWhereWithoutChunksInput, SourceUpdateWithoutChunksInput>, SourceUncheckedUpdateWithoutChunksInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumLanguageFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | EnumLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumLanguageFilter<$PrismaModel> | $Enums.Language
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumLanguageWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Language | EnumLanguageFieldRefInput<$PrismaModel>
    in?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    notIn?: $Enums.Language[] | ListEnumLanguageFieldRefInput<$PrismaModel>
    not?: NestedEnumLanguageWithAggregatesFilter<$PrismaModel> | $Enums.Language
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLanguageFilter<$PrismaModel>
    _max?: NestedEnumLanguageFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type RoleChangeAuditCreateWithoutTargetInput = {
    fromRole: string
    toRole: string
    actorEmail: string
    actorName?: string | null
    createdAt?: Date | string
  }

  export type RoleChangeAuditUncheckedCreateWithoutTargetInput = {
    id?: number
    fromRole: string
    toRole: string
    actorEmail: string
    actorName?: string | null
    createdAt?: Date | string
  }

  export type RoleChangeAuditCreateOrConnectWithoutTargetInput = {
    where: RoleChangeAuditWhereUniqueInput
    create: XOR<RoleChangeAuditCreateWithoutTargetInput, RoleChangeAuditUncheckedCreateWithoutTargetInput>
  }

  export type RoleChangeAuditCreateManyTargetInputEnvelope = {
    data: RoleChangeAuditCreateManyTargetInput | RoleChangeAuditCreateManyTargetInput[]
    skipDuplicates?: boolean
  }

  export type PasswordResetCodeCreateWithoutUserInput = {
    email: string
    codeHash: string
    salt: string
    attempts?: number
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetCodeUncheckedCreateWithoutUserInput = {
    id?: number
    email: string
    codeHash: string
    salt: string
    attempts?: number
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PasswordResetCodeCreateOrConnectWithoutUserInput = {
    where: PasswordResetCodeWhereUniqueInput
    create: XOR<PasswordResetCodeCreateWithoutUserInput, PasswordResetCodeUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetCodeCreateManyUserInputEnvelope = {
    data: PasswordResetCodeCreateManyUserInput | PasswordResetCodeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SupplierTypeAssignmentCreateWithoutUserInput = {
    category: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierTypeAssignmentUncheckedCreateWithoutUserInput = {
    id?: number
    category: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SupplierTypeAssignmentCreateOrConnectWithoutUserInput = {
    where: SupplierTypeAssignmentWhereUniqueInput
    create: XOR<SupplierTypeAssignmentCreateWithoutUserInput, SupplierTypeAssignmentUncheckedCreateWithoutUserInput>
  }

  export type SupplierTypeAssignmentCreateManyUserInputEnvelope = {
    data: SupplierTypeAssignmentCreateManyUserInput | SupplierTypeAssignmentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    title: string
    message: string
    type?: string
    channel?: string
    refType?: string | null
    refId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    readAt?: Date | string | null
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: number
    title: string
    message: string
    type?: string
    channel?: string
    refType?: string | null
    refId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    readAt?: Date | string | null
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FeedbackCreateWithoutUserInput = {
    type: string
    description: string
    status?: string
    adminComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeedbackUncheckedCreateWithoutUserInput = {
    id?: number
    type: string
    description: string
    status?: string
    adminComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeedbackCreateOrConnectWithoutUserInput = {
    where: FeedbackWhereUniqueInput
    create: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput>
  }

  export type FeedbackCreateManyUserInputEnvelope = {
    data: FeedbackCreateManyUserInput | FeedbackCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ChatSessionCreateWithoutUserInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageCreateNestedManyWithoutSessionInput
    sources?: SourceCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutUserInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutSessionInput
    sources?: SourceUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput>
  }

  export type ChatSessionCreateManyUserInputEnvelope = {
    data: ChatSessionCreateManyUserInput | ChatSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SourceCreateWithoutUserInput = {
    id?: string
    fileName: string
    filePath: string
    fileType: string
    fileSize: number
    uploadedAt?: Date | string
    session?: ChatSessionCreateNestedOneWithoutSourcesInput
    chunks?: SourceChunkCreateNestedManyWithoutSourceInput
  }

  export type SourceUncheckedCreateWithoutUserInput = {
    id?: string
    sessionId?: string | null
    fileName: string
    filePath: string
    fileType: string
    fileSize: number
    uploadedAt?: Date | string
    chunks?: SourceChunkUncheckedCreateNestedManyWithoutSourceInput
  }

  export type SourceCreateOrConnectWithoutUserInput = {
    where: SourceWhereUniqueInput
    create: XOR<SourceCreateWithoutUserInput, SourceUncheckedCreateWithoutUserInput>
  }

  export type SourceCreateManyUserInputEnvelope = {
    data: SourceCreateManyUserInput | SourceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RoleChangeAuditUpsertWithWhereUniqueWithoutTargetInput = {
    where: RoleChangeAuditWhereUniqueInput
    update: XOR<RoleChangeAuditUpdateWithoutTargetInput, RoleChangeAuditUncheckedUpdateWithoutTargetInput>
    create: XOR<RoleChangeAuditCreateWithoutTargetInput, RoleChangeAuditUncheckedCreateWithoutTargetInput>
  }

  export type RoleChangeAuditUpdateWithWhereUniqueWithoutTargetInput = {
    where: RoleChangeAuditWhereUniqueInput
    data: XOR<RoleChangeAuditUpdateWithoutTargetInput, RoleChangeAuditUncheckedUpdateWithoutTargetInput>
  }

  export type RoleChangeAuditUpdateManyWithWhereWithoutTargetInput = {
    where: RoleChangeAuditScalarWhereInput
    data: XOR<RoleChangeAuditUpdateManyMutationInput, RoleChangeAuditUncheckedUpdateManyWithoutTargetInput>
  }

  export type RoleChangeAuditScalarWhereInput = {
    AND?: RoleChangeAuditScalarWhereInput | RoleChangeAuditScalarWhereInput[]
    OR?: RoleChangeAuditScalarWhereInput[]
    NOT?: RoleChangeAuditScalarWhereInput | RoleChangeAuditScalarWhereInput[]
    id?: IntFilter<"RoleChangeAudit"> | number
    targetId?: IntFilter<"RoleChangeAudit"> | number
    fromRole?: StringFilter<"RoleChangeAudit"> | string
    toRole?: StringFilter<"RoleChangeAudit"> | string
    actorEmail?: StringFilter<"RoleChangeAudit"> | string
    actorName?: StringNullableFilter<"RoleChangeAudit"> | string | null
    createdAt?: DateTimeFilter<"RoleChangeAudit"> | Date | string
  }

  export type PasswordResetCodeUpsertWithWhereUniqueWithoutUserInput = {
    where: PasswordResetCodeWhereUniqueInput
    update: XOR<PasswordResetCodeUpdateWithoutUserInput, PasswordResetCodeUncheckedUpdateWithoutUserInput>
    create: XOR<PasswordResetCodeCreateWithoutUserInput, PasswordResetCodeUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetCodeUpdateWithWhereUniqueWithoutUserInput = {
    where: PasswordResetCodeWhereUniqueInput
    data: XOR<PasswordResetCodeUpdateWithoutUserInput, PasswordResetCodeUncheckedUpdateWithoutUserInput>
  }

  export type PasswordResetCodeUpdateManyWithWhereWithoutUserInput = {
    where: PasswordResetCodeScalarWhereInput
    data: XOR<PasswordResetCodeUpdateManyMutationInput, PasswordResetCodeUncheckedUpdateManyWithoutUserInput>
  }

  export type PasswordResetCodeScalarWhereInput = {
    AND?: PasswordResetCodeScalarWhereInput | PasswordResetCodeScalarWhereInput[]
    OR?: PasswordResetCodeScalarWhereInput[]
    NOT?: PasswordResetCodeScalarWhereInput | PasswordResetCodeScalarWhereInput[]
    id?: IntFilter<"PasswordResetCode"> | number
    userId?: IntFilter<"PasswordResetCode"> | number
    email?: StringFilter<"PasswordResetCode"> | string
    codeHash?: StringFilter<"PasswordResetCode"> | string
    salt?: StringFilter<"PasswordResetCode"> | string
    attempts?: IntFilter<"PasswordResetCode"> | number
    expiresAt?: DateTimeFilter<"PasswordResetCode"> | Date | string
    usedAt?: DateTimeNullableFilter<"PasswordResetCode"> | Date | string | null
    createdAt?: DateTimeFilter<"PasswordResetCode"> | Date | string
  }

  export type SupplierTypeAssignmentUpsertWithWhereUniqueWithoutUserInput = {
    where: SupplierTypeAssignmentWhereUniqueInput
    update: XOR<SupplierTypeAssignmentUpdateWithoutUserInput, SupplierTypeAssignmentUncheckedUpdateWithoutUserInput>
    create: XOR<SupplierTypeAssignmentCreateWithoutUserInput, SupplierTypeAssignmentUncheckedCreateWithoutUserInput>
  }

  export type SupplierTypeAssignmentUpdateWithWhereUniqueWithoutUserInput = {
    where: SupplierTypeAssignmentWhereUniqueInput
    data: XOR<SupplierTypeAssignmentUpdateWithoutUserInput, SupplierTypeAssignmentUncheckedUpdateWithoutUserInput>
  }

  export type SupplierTypeAssignmentUpdateManyWithWhereWithoutUserInput = {
    where: SupplierTypeAssignmentScalarWhereInput
    data: XOR<SupplierTypeAssignmentUpdateManyMutationInput, SupplierTypeAssignmentUncheckedUpdateManyWithoutUserInput>
  }

  export type SupplierTypeAssignmentScalarWhereInput = {
    AND?: SupplierTypeAssignmentScalarWhereInput | SupplierTypeAssignmentScalarWhereInput[]
    OR?: SupplierTypeAssignmentScalarWhereInput[]
    NOT?: SupplierTypeAssignmentScalarWhereInput | SupplierTypeAssignmentScalarWhereInput[]
    id?: IntFilter<"SupplierTypeAssignment"> | number
    userId?: IntFilter<"SupplierTypeAssignment"> | number
    category?: StringFilter<"SupplierTypeAssignment"> | string
    createdAt?: DateTimeFilter<"SupplierTypeAssignment"> | Date | string
    updatedAt?: DateTimeFilter<"SupplierTypeAssignment"> | Date | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: IntFilter<"Notification"> | number
    userId?: IntFilter<"Notification"> | number
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: StringFilter<"Notification"> | string
    channel?: StringFilter<"Notification"> | string
    refType?: StringNullableFilter<"Notification"> | string | null
    refId?: StringNullableFilter<"Notification"> | string | null
    isRead?: BoolFilter<"Notification"> | boolean
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    readAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
  }

  export type FeedbackUpsertWithWhereUniqueWithoutUserInput = {
    where: FeedbackWhereUniqueInput
    update: XOR<FeedbackUpdateWithoutUserInput, FeedbackUncheckedUpdateWithoutUserInput>
    create: XOR<FeedbackCreateWithoutUserInput, FeedbackUncheckedCreateWithoutUserInput>
  }

  export type FeedbackUpdateWithWhereUniqueWithoutUserInput = {
    where: FeedbackWhereUniqueInput
    data: XOR<FeedbackUpdateWithoutUserInput, FeedbackUncheckedUpdateWithoutUserInput>
  }

  export type FeedbackUpdateManyWithWhereWithoutUserInput = {
    where: FeedbackScalarWhereInput
    data: XOR<FeedbackUpdateManyMutationInput, FeedbackUncheckedUpdateManyWithoutUserInput>
  }

  export type FeedbackScalarWhereInput = {
    AND?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
    OR?: FeedbackScalarWhereInput[]
    NOT?: FeedbackScalarWhereInput | FeedbackScalarWhereInput[]
    id?: IntFilter<"Feedback"> | number
    userId?: IntFilter<"Feedback"> | number
    type?: StringFilter<"Feedback"> | string
    description?: StringFilter<"Feedback"> | string
    status?: StringFilter<"Feedback"> | string
    adminComment?: StringNullableFilter<"Feedback"> | string | null
    createdAt?: DateTimeFilter<"Feedback"> | Date | string
    updatedAt?: DateTimeFilter<"Feedback"> | Date | string
  }

  export type ChatSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    update: XOR<ChatSessionUpdateWithoutUserInput, ChatSessionUncheckedUpdateWithoutUserInput>
    create: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput>
  }

  export type ChatSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    data: XOR<ChatSessionUpdateWithoutUserInput, ChatSessionUncheckedUpdateWithoutUserInput>
  }

  export type ChatSessionUpdateManyWithWhereWithoutUserInput = {
    where: ChatSessionScalarWhereInput
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type ChatSessionScalarWhereInput = {
    AND?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
    OR?: ChatSessionScalarWhereInput[]
    NOT?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
    id?: StringFilter<"ChatSession"> | string
    userId?: IntFilter<"ChatSession"> | number
    title?: StringNullableFilter<"ChatSession"> | string | null
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
  }

  export type SourceUpsertWithWhereUniqueWithoutUserInput = {
    where: SourceWhereUniqueInput
    update: XOR<SourceUpdateWithoutUserInput, SourceUncheckedUpdateWithoutUserInput>
    create: XOR<SourceCreateWithoutUserInput, SourceUncheckedCreateWithoutUserInput>
  }

  export type SourceUpdateWithWhereUniqueWithoutUserInput = {
    where: SourceWhereUniqueInput
    data: XOR<SourceUpdateWithoutUserInput, SourceUncheckedUpdateWithoutUserInput>
  }

  export type SourceUpdateManyWithWhereWithoutUserInput = {
    where: SourceScalarWhereInput
    data: XOR<SourceUpdateManyMutationInput, SourceUncheckedUpdateManyWithoutUserInput>
  }

  export type SourceScalarWhereInput = {
    AND?: SourceScalarWhereInput | SourceScalarWhereInput[]
    OR?: SourceScalarWhereInput[]
    NOT?: SourceScalarWhereInput | SourceScalarWhereInput[]
    id?: StringFilter<"Source"> | string
    userId?: IntFilter<"Source"> | number
    sessionId?: StringNullableFilter<"Source"> | string | null
    fileName?: StringFilter<"Source"> | string
    filePath?: StringFilter<"Source"> | string
    fileType?: StringFilter<"Source"> | string
    fileSize?: IntFilter<"Source"> | number
    uploadedAt?: DateTimeFilter<"Source"> | Date | string
  }

  export type UserCreateWithoutNotificationsInput = {
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditCreateNestedManyWithoutTargetInput
    passwordResetCodes?: PasswordResetCodeCreateNestedManyWithoutUserInput
    supplierTypeAssignments?: SupplierTypeAssignmentCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
    sources?: SourceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: number
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedCreateNestedManyWithoutTargetInput
    passwordResetCodes?: PasswordResetCodeUncheckedCreateNestedManyWithoutUserInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    sources?: SourceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUpdateManyWithoutTargetNestedInput
    passwordResetCodes?: PasswordResetCodeUpdateManyWithoutUserNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
    sources?: SourceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedUpdateManyWithoutTargetNestedInput
    passwordResetCodes?: PasswordResetCodeUncheckedUpdateManyWithoutUserNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    sources?: SourceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutFeedbacksInput = {
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditCreateNestedManyWithoutTargetInput
    passwordResetCodes?: PasswordResetCodeCreateNestedManyWithoutUserInput
    supplierTypeAssignments?: SupplierTypeAssignmentCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
    sources?: SourceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutFeedbacksInput = {
    id?: number
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedCreateNestedManyWithoutTargetInput
    passwordResetCodes?: PasswordResetCodeUncheckedCreateNestedManyWithoutUserInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    sources?: SourceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutFeedbacksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFeedbacksInput, UserUncheckedCreateWithoutFeedbacksInput>
  }

  export type UserUpsertWithoutFeedbacksInput = {
    update: XOR<UserUpdateWithoutFeedbacksInput, UserUncheckedUpdateWithoutFeedbacksInput>
    create: XOR<UserCreateWithoutFeedbacksInput, UserUncheckedCreateWithoutFeedbacksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutFeedbacksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutFeedbacksInput, UserUncheckedUpdateWithoutFeedbacksInput>
  }

  export type UserUpdateWithoutFeedbacksInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUpdateManyWithoutTargetNestedInput
    passwordResetCodes?: PasswordResetCodeUpdateManyWithoutUserNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
    sources?: SourceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutFeedbacksInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedUpdateManyWithoutTargetNestedInput
    passwordResetCodes?: PasswordResetCodeUncheckedUpdateManyWithoutUserNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    sources?: SourceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutRoleChangeAuditsAsTargetInput = {
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    passwordResetCodes?: PasswordResetCodeCreateNestedManyWithoutUserInput
    supplierTypeAssignments?: SupplierTypeAssignmentCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
    sources?: SourceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRoleChangeAuditsAsTargetInput = {
    id?: number
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    passwordResetCodes?: PasswordResetCodeUncheckedCreateNestedManyWithoutUserInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    sources?: SourceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRoleChangeAuditsAsTargetInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRoleChangeAuditsAsTargetInput, UserUncheckedCreateWithoutRoleChangeAuditsAsTargetInput>
  }

  export type UserUpsertWithoutRoleChangeAuditsAsTargetInput = {
    update: XOR<UserUpdateWithoutRoleChangeAuditsAsTargetInput, UserUncheckedUpdateWithoutRoleChangeAuditsAsTargetInput>
    create: XOR<UserCreateWithoutRoleChangeAuditsAsTargetInput, UserUncheckedCreateWithoutRoleChangeAuditsAsTargetInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRoleChangeAuditsAsTargetInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRoleChangeAuditsAsTargetInput, UserUncheckedUpdateWithoutRoleChangeAuditsAsTargetInput>
  }

  export type UserUpdateWithoutRoleChangeAuditsAsTargetInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    passwordResetCodes?: PasswordResetCodeUpdateManyWithoutUserNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
    sources?: SourceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRoleChangeAuditsAsTargetInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    passwordResetCodes?: PasswordResetCodeUncheckedUpdateManyWithoutUserNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    sources?: SourceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPasswordResetCodesInput = {
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditCreateNestedManyWithoutTargetInput
    supplierTypeAssignments?: SupplierTypeAssignmentCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
    sources?: SourceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPasswordResetCodesInput = {
    id?: number
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedCreateNestedManyWithoutTargetInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    sources?: SourceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPasswordResetCodesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPasswordResetCodesInput, UserUncheckedCreateWithoutPasswordResetCodesInput>
  }

  export type UserUpsertWithoutPasswordResetCodesInput = {
    update: XOR<UserUpdateWithoutPasswordResetCodesInput, UserUncheckedUpdateWithoutPasswordResetCodesInput>
    create: XOR<UserCreateWithoutPasswordResetCodesInput, UserUncheckedCreateWithoutPasswordResetCodesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPasswordResetCodesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPasswordResetCodesInput, UserUncheckedUpdateWithoutPasswordResetCodesInput>
  }

  export type UserUpdateWithoutPasswordResetCodesInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUpdateManyWithoutTargetNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
    sources?: SourceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPasswordResetCodesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedUpdateManyWithoutTargetNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    sources?: SourceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSupplierTypeAssignmentsInput = {
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditCreateNestedManyWithoutTargetInput
    passwordResetCodes?: PasswordResetCodeCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
    sources?: SourceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSupplierTypeAssignmentsInput = {
    id?: number
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedCreateNestedManyWithoutTargetInput
    passwordResetCodes?: PasswordResetCodeUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
    sources?: SourceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSupplierTypeAssignmentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSupplierTypeAssignmentsInput, UserUncheckedCreateWithoutSupplierTypeAssignmentsInput>
  }

  export type UserUpsertWithoutSupplierTypeAssignmentsInput = {
    update: XOR<UserUpdateWithoutSupplierTypeAssignmentsInput, UserUncheckedUpdateWithoutSupplierTypeAssignmentsInput>
    create: XOR<UserCreateWithoutSupplierTypeAssignmentsInput, UserUncheckedCreateWithoutSupplierTypeAssignmentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSupplierTypeAssignmentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSupplierTypeAssignmentsInput, UserUncheckedUpdateWithoutSupplierTypeAssignmentsInput>
  }

  export type UserUpdateWithoutSupplierTypeAssignmentsInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUpdateManyWithoutTargetNestedInput
    passwordResetCodes?: PasswordResetCodeUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
    sources?: SourceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSupplierTypeAssignmentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedUpdateManyWithoutTargetNestedInput
    passwordResetCodes?: PasswordResetCodeUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
    sources?: SourceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutChatSessionsInput = {
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditCreateNestedManyWithoutTargetInput
    passwordResetCodes?: PasswordResetCodeCreateNestedManyWithoutUserInput
    supplierTypeAssignments?: SupplierTypeAssignmentCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackCreateNestedManyWithoutUserInput
    sources?: SourceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChatSessionsInput = {
    id?: number
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedCreateNestedManyWithoutTargetInput
    passwordResetCodes?: PasswordResetCodeUncheckedCreateNestedManyWithoutUserInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackUncheckedCreateNestedManyWithoutUserInput
    sources?: SourceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChatSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
  }

  export type ChatMessageCreateWithoutSessionInput = {
    role: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageUncheckedCreateWithoutSessionInput = {
    id?: number
    role: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ChatMessageCreateOrConnectWithoutSessionInput = {
    where: ChatMessageWhereUniqueInput
    create: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput>
  }

  export type ChatMessageCreateManySessionInputEnvelope = {
    data: ChatMessageCreateManySessionInput | ChatMessageCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type SourceCreateWithoutSessionInput = {
    id?: string
    fileName: string
    filePath: string
    fileType: string
    fileSize: number
    uploadedAt?: Date | string
    user: UserCreateNestedOneWithoutSourcesInput
    chunks?: SourceChunkCreateNestedManyWithoutSourceInput
  }

  export type SourceUncheckedCreateWithoutSessionInput = {
    id?: string
    userId: number
    fileName: string
    filePath: string
    fileType: string
    fileSize: number
    uploadedAt?: Date | string
    chunks?: SourceChunkUncheckedCreateNestedManyWithoutSourceInput
  }

  export type SourceCreateOrConnectWithoutSessionInput = {
    where: SourceWhereUniqueInput
    create: XOR<SourceCreateWithoutSessionInput, SourceUncheckedCreateWithoutSessionInput>
  }

  export type SourceCreateManySessionInputEnvelope = {
    data: SourceCreateManySessionInput | SourceCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutChatSessionsInput = {
    update: XOR<UserUpdateWithoutChatSessionsInput, UserUncheckedUpdateWithoutChatSessionsInput>
    create: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChatSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChatSessionsInput, UserUncheckedUpdateWithoutChatSessionsInput>
  }

  export type UserUpdateWithoutChatSessionsInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUpdateManyWithoutTargetNestedInput
    passwordResetCodes?: PasswordResetCodeUpdateManyWithoutUserNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUpdateManyWithoutUserNestedInput
    sources?: SourceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChatSessionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedUpdateManyWithoutTargetNestedInput
    passwordResetCodes?: PasswordResetCodeUncheckedUpdateManyWithoutUserNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
    sources?: SourceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChatMessageUpsertWithWhereUniqueWithoutSessionInput = {
    where: ChatMessageWhereUniqueInput
    update: XOR<ChatMessageUpdateWithoutSessionInput, ChatMessageUncheckedUpdateWithoutSessionInput>
    create: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput>
  }

  export type ChatMessageUpdateWithWhereUniqueWithoutSessionInput = {
    where: ChatMessageWhereUniqueInput
    data: XOR<ChatMessageUpdateWithoutSessionInput, ChatMessageUncheckedUpdateWithoutSessionInput>
  }

  export type ChatMessageUpdateManyWithWhereWithoutSessionInput = {
    where: ChatMessageScalarWhereInput
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyWithoutSessionInput>
  }

  export type ChatMessageScalarWhereInput = {
    AND?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    OR?: ChatMessageScalarWhereInput[]
    NOT?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    id?: IntFilter<"ChatMessage"> | number
    sessionId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    content?: StringFilter<"ChatMessage"> | string
    metadata?: JsonNullableFilter<"ChatMessage">
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
  }

  export type SourceUpsertWithWhereUniqueWithoutSessionInput = {
    where: SourceWhereUniqueInput
    update: XOR<SourceUpdateWithoutSessionInput, SourceUncheckedUpdateWithoutSessionInput>
    create: XOR<SourceCreateWithoutSessionInput, SourceUncheckedCreateWithoutSessionInput>
  }

  export type SourceUpdateWithWhereUniqueWithoutSessionInput = {
    where: SourceWhereUniqueInput
    data: XOR<SourceUpdateWithoutSessionInput, SourceUncheckedUpdateWithoutSessionInput>
  }

  export type SourceUpdateManyWithWhereWithoutSessionInput = {
    where: SourceScalarWhereInput
    data: XOR<SourceUpdateManyMutationInput, SourceUncheckedUpdateManyWithoutSessionInput>
  }

  export type ChatSessionCreateWithoutMessagesInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutChatSessionsInput
    sources?: SourceCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutMessagesInput = {
    id?: string
    userId: number
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sources?: SourceUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutMessagesInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
  }

  export type ChatSessionUpsertWithoutMessagesInput = {
    update: XOR<ChatSessionUpdateWithoutMessagesInput, ChatSessionUncheckedUpdateWithoutMessagesInput>
    create: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    where?: ChatSessionWhereInput
  }

  export type ChatSessionUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ChatSessionWhereInput
    data: XOR<ChatSessionUpdateWithoutMessagesInput, ChatSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type ChatSessionUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
    sources?: SourceUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sources?: SourceUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type UserCreateWithoutSourcesInput = {
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditCreateNestedManyWithoutTargetInput
    passwordResetCodes?: PasswordResetCodeCreateNestedManyWithoutUserInput
    supplierTypeAssignments?: SupplierTypeAssignmentCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSourcesInput = {
    id?: number
    name?: string | null
    email: string
    password: string
    role?: string
    department?: string | null
    avatarUrl?: string | null
    isActive?: boolean
    preferredLanguage?: $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedCreateNestedManyWithoutTargetInput
    passwordResetCodes?: PasswordResetCodeUncheckedCreateNestedManyWithoutUserInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    feedbacks?: FeedbackUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSourcesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSourcesInput, UserUncheckedCreateWithoutSourcesInput>
  }

  export type ChatSessionCreateWithoutSourcesInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutChatSessionsInput
    messages?: ChatMessageCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutSourcesInput = {
    id?: string
    userId: number
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutSourcesInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutSourcesInput, ChatSessionUncheckedCreateWithoutSourcesInput>
  }

  export type SourceChunkCreateWithoutSourceInput = {
    id?: string
    content: string
    chunkIndex: number
  }

  export type SourceChunkUncheckedCreateWithoutSourceInput = {
    id?: string
    content: string
    chunkIndex: number
  }

  export type SourceChunkCreateOrConnectWithoutSourceInput = {
    where: SourceChunkWhereUniqueInput
    create: XOR<SourceChunkCreateWithoutSourceInput, SourceChunkUncheckedCreateWithoutSourceInput>
  }

  export type SourceChunkCreateManySourceInputEnvelope = {
    data: SourceChunkCreateManySourceInput | SourceChunkCreateManySourceInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutSourcesInput = {
    update: XOR<UserUpdateWithoutSourcesInput, UserUncheckedUpdateWithoutSourcesInput>
    create: XOR<UserCreateWithoutSourcesInput, UserUncheckedCreateWithoutSourcesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSourcesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSourcesInput, UserUncheckedUpdateWithoutSourcesInput>
  }

  export type UserUpdateWithoutSourcesInput = {
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUpdateManyWithoutTargetNestedInput
    passwordResetCodes?: PasswordResetCodeUpdateManyWithoutUserNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSourcesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    department?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    preferredLanguage?: EnumLanguageFieldUpdateOperationsInput | $Enums.Language
    roleChangeAuditsAsTarget?: RoleChangeAuditUncheckedUpdateManyWithoutTargetNestedInput
    passwordResetCodes?: PasswordResetCodeUncheckedUpdateManyWithoutUserNestedInput
    supplierTypeAssignments?: SupplierTypeAssignmentUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    feedbacks?: FeedbackUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChatSessionUpsertWithoutSourcesInput = {
    update: XOR<ChatSessionUpdateWithoutSourcesInput, ChatSessionUncheckedUpdateWithoutSourcesInput>
    create: XOR<ChatSessionCreateWithoutSourcesInput, ChatSessionUncheckedCreateWithoutSourcesInput>
    where?: ChatSessionWhereInput
  }

  export type ChatSessionUpdateToOneWithWhereWithoutSourcesInput = {
    where?: ChatSessionWhereInput
    data: XOR<ChatSessionUpdateWithoutSourcesInput, ChatSessionUncheckedUpdateWithoutSourcesInput>
  }

  export type ChatSessionUpdateWithoutSourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
    messages?: ChatMessageUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutSourcesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type SourceChunkUpsertWithWhereUniqueWithoutSourceInput = {
    where: SourceChunkWhereUniqueInput
    update: XOR<SourceChunkUpdateWithoutSourceInput, SourceChunkUncheckedUpdateWithoutSourceInput>
    create: XOR<SourceChunkCreateWithoutSourceInput, SourceChunkUncheckedCreateWithoutSourceInput>
  }

  export type SourceChunkUpdateWithWhereUniqueWithoutSourceInput = {
    where: SourceChunkWhereUniqueInput
    data: XOR<SourceChunkUpdateWithoutSourceInput, SourceChunkUncheckedUpdateWithoutSourceInput>
  }

  export type SourceChunkUpdateManyWithWhereWithoutSourceInput = {
    where: SourceChunkScalarWhereInput
    data: XOR<SourceChunkUpdateManyMutationInput, SourceChunkUncheckedUpdateManyWithoutSourceInput>
  }

  export type SourceChunkScalarWhereInput = {
    AND?: SourceChunkScalarWhereInput | SourceChunkScalarWhereInput[]
    OR?: SourceChunkScalarWhereInput[]
    NOT?: SourceChunkScalarWhereInput | SourceChunkScalarWhereInput[]
    id?: StringFilter<"SourceChunk"> | string
    sourceId?: StringFilter<"SourceChunk"> | string
    content?: StringFilter<"SourceChunk"> | string
    chunkIndex?: IntFilter<"SourceChunk"> | number
  }

  export type SourceCreateWithoutChunksInput = {
    id?: string
    fileName: string
    filePath: string
    fileType: string
    fileSize: number
    uploadedAt?: Date | string
    user: UserCreateNestedOneWithoutSourcesInput
    session?: ChatSessionCreateNestedOneWithoutSourcesInput
  }

  export type SourceUncheckedCreateWithoutChunksInput = {
    id?: string
    userId: number
    sessionId?: string | null
    fileName: string
    filePath: string
    fileType: string
    fileSize: number
    uploadedAt?: Date | string
  }

  export type SourceCreateOrConnectWithoutChunksInput = {
    where: SourceWhereUniqueInput
    create: XOR<SourceCreateWithoutChunksInput, SourceUncheckedCreateWithoutChunksInput>
  }

  export type SourceUpsertWithoutChunksInput = {
    update: XOR<SourceUpdateWithoutChunksInput, SourceUncheckedUpdateWithoutChunksInput>
    create: XOR<SourceCreateWithoutChunksInput, SourceUncheckedCreateWithoutChunksInput>
    where?: SourceWhereInput
  }

  export type SourceUpdateToOneWithWhereWithoutChunksInput = {
    where?: SourceWhereInput
    data: XOR<SourceUpdateWithoutChunksInput, SourceUncheckedUpdateWithoutChunksInput>
  }

  export type SourceUpdateWithoutChunksInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSourcesNestedInput
    session?: ChatSessionUpdateOneWithoutSourcesNestedInput
  }

  export type SourceUncheckedUpdateWithoutChunksInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleChangeAuditCreateManyTargetInput = {
    id?: number
    fromRole: string
    toRole: string
    actorEmail: string
    actorName?: string | null
    createdAt?: Date | string
  }

  export type PasswordResetCodeCreateManyUserInput = {
    id?: number
    email: string
    codeHash: string
    salt: string
    attempts?: number
    expiresAt: Date | string
    usedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type SupplierTypeAssignmentCreateManyUserInput = {
    id?: number
    category: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: number
    title: string
    message: string
    type?: string
    channel?: string
    refType?: string | null
    refId?: string | null
    isRead?: boolean
    createdAt?: Date | string
    readAt?: Date | string | null
  }

  export type FeedbackCreateManyUserInput = {
    id?: number
    type: string
    description: string
    status?: string
    adminComment?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatSessionCreateManyUserInput = {
    id?: string
    title?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SourceCreateManyUserInput = {
    id?: string
    sessionId?: string | null
    fileName: string
    filePath: string
    fileType: string
    fileSize: number
    uploadedAt?: Date | string
  }

  export type RoleChangeAuditUpdateWithoutTargetInput = {
    fromRole?: StringFieldUpdateOperationsInput | string
    toRole?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    actorName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleChangeAuditUncheckedUpdateWithoutTargetInput = {
    id?: IntFieldUpdateOperationsInput | number
    fromRole?: StringFieldUpdateOperationsInput | string
    toRole?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    actorName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleChangeAuditUncheckedUpdateManyWithoutTargetInput = {
    id?: IntFieldUpdateOperationsInput | number
    fromRole?: StringFieldUpdateOperationsInput | string
    toRole?: StringFieldUpdateOperationsInput | string
    actorEmail?: StringFieldUpdateOperationsInput | string
    actorName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCodeUpdateWithoutUserInput = {
    email?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    salt?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCodeUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    salt?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetCodeUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    codeHash?: StringFieldUpdateOperationsInput | string
    salt?: StringFieldUpdateOperationsInput | string
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierTypeAssignmentUpdateWithoutUserInput = {
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierTypeAssignmentUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SupplierTypeAssignmentUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    refType?: NullableStringFieldUpdateOperationsInput | string | null
    refId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    refType?: NullableStringFieldUpdateOperationsInput | string | null
    refId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    channel?: StringFieldUpdateOperationsInput | string
    refType?: NullableStringFieldUpdateOperationsInput | string | null
    refId?: NullableStringFieldUpdateOperationsInput | string | null
    isRead?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FeedbackUpdateWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    adminComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    adminComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeedbackUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    adminComment?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUpdateManyWithoutSessionNestedInput
    sources?: SourceUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutSessionNestedInput
    sources?: SourceUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: ChatSessionUpdateOneWithoutSourcesNestedInput
    chunks?: SourceChunkUpdateManyWithoutSourceNestedInput
  }

  export type SourceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chunks?: SourceChunkUncheckedUpdateManyWithoutSourceNestedInput
  }

  export type SourceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateManySessionInput = {
    id?: number
    role: string
    content: string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SourceCreateManySessionInput = {
    id?: string
    userId: number
    fileName: string
    filePath: string
    fileType: string
    fileSize: number
    uploadedAt?: Date | string
  }

  export type ChatMessageUpdateWithoutSessionInput = {
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateWithoutSessionInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyWithoutSessionInput = {
    id?: IntFieldUpdateOperationsInput | number
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSourcesNestedInput
    chunks?: SourceChunkUpdateManyWithoutSourceNestedInput
  }

  export type SourceUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chunks?: SourceChunkUncheckedUpdateManyWithoutSourceNestedInput
  }

  export type SourceUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    fileName?: StringFieldUpdateOperationsInput | string
    filePath?: StringFieldUpdateOperationsInput | string
    fileType?: StringFieldUpdateOperationsInput | string
    fileSize?: IntFieldUpdateOperationsInput | number
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SourceChunkCreateManySourceInput = {
    id?: string
    content: string
    chunkIndex: number
  }

  export type SourceChunkUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
  }

  export type SourceChunkUncheckedUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
  }

  export type SourceChunkUncheckedUpdateManyWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    chunkIndex?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}