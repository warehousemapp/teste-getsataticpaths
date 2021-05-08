import axios from "axios";
import { useRouter } from "next/router";
import { User } from "../../../api/User";
import { GetStaticProps, InferGetStaticPropsType, GetStaticPaths } from "next";
export interface UserProps {
  user: User;
}

function Profile({ user }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  if (router.isFallback) return <h1>carregando...</h1>;

  return (
    <div>
      <p>{user.ID}</p>
      <p>{user.nome}</p>
      <p>{user.slug}</p>
    </div>
  );
}

export const getStaticProps: GetStaticProps<UserProps> = async (context) => {
  const response = await axios.get(
    "https://back-end-warehouseapp.herokuapp.com/teste",
    { params: { id: context.params.id } }
  );
  const user = await response.data[0];

  return {
    props: { user, revalidate: 10 } // will be passed to the page component as props
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await axios.get(
    "https://back-end-warehouseapp.herokuapp.com/teste"
  );
  const users = await response.data.slice(0, 5);

  const paths = users.map((user) => {
    return { params: { id: String(user.ID) } };
  });

  return {
    paths,
    fallback: true // See the "fallback" section below
  };
};

export default Profile;
