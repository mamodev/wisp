import { PageLayout } from "../../components/layout/PageLayout";
import { axiosJson } from "../../context/AuthContext";
import { Organization } from "../../types/api/Organization";
import { NextPageWithLayout } from "../_app";

type OragnizationPageProps = { organization: Organization };

const OrganizationPage: NextPageWithLayout<OragnizationPageProps> = ({
  organization,
}: OragnizationPageProps) => {
  return <></>;
};

OrganizationPage.getLayout = function getLayout(page: React.ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export async function getServerSideProps() {
  const response = await axiosJson.get("organization/9119da54-c4b0-429c-a6dd-e7c9592b7b5d");
  const organizationData = response.data as Organization;
  console.log(organizationData);
  return {
    props: {},
  };
}

export default OrganizationPage;
