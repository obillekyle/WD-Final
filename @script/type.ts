export type DeepNonFunc<T> = T extends Array<infer U> ? Array<DeepNonFunc<U>> : T extends object ? StaticObject<T> : T;

type OptionalKey<T> = {
  [K in keyof T as T[K] extends undefined ? K : never]?: DeepNonFunc<T[K]>;
};

type RequiredKey<T> = {
  [K in keyof T as T[K] extends undefined ? never : K]: DeepNonFunc<T[K]>;
};

type Normalize<T> = OptionalKey<T> & RequiredKey<T>;

export type StaticObject<T> = ExcludeStartsWith<Normalize<{ 
  // biome-ignore lint/complexity/noBannedTypes: Func
  [K in keyof T as T[K] extends Function
    ? never 
    : K extends symbol 
      ? never
      : K
  ] : DeepNonFunc<T[K]> 
}>, "_">

export type IPObject = {
  ipVersion: number;
  ipAddress: string;
  latitude: number;
  longitude: number;
  countryName: string;
  countryCode: string;
  timeZone: string;
  zipCode: string;
  cityName: string;
  regionName: string;
  isProxy: boolean;
  continent: string;
  continentCode: string;
  currency: {
    code: string;
    name: string;
  };
  language: string;
  timeZones: string[];
  tlds: string[];
}

type KeysStartingWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}` ? Set : never;
export type ExcludeStartsWith<T, NotStartWith extends string> = Omit<T, KeysStartingWith<keyof T, NotStartWith>>;