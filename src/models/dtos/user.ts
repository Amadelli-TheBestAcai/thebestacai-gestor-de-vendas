export type UserDto = {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  level: number;
  image: string;
  token: string;
  is_actived: boolean;
  permissions: string[];
  modules: {
    id: number,
    image: string,
    name: string,
    description: string,
    url: string
  }[]
};
