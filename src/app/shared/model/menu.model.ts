interface MenuNode {
  name: string;
  modNumber: string;
  icon: string;
  iconLink: string;
  encrvar: string;
  children?: MenuNode[];
  sum?: number;
}
