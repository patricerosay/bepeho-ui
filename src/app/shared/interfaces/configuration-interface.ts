export class Property {
  name: string;
  value: string;
  group: string;
  subGroup: String;
  displayName: string;
  type: string;
}

export class Properties {
  advanced: Property[];
  general: Property[];
}
export class Configuration {
    displayGroup: string;
    bundleName: string;
    props: Properties;

  }

