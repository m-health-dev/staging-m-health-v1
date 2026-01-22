import NotFoundContent from "@/components/utility/NotFoundContent";
import { getLocale } from "next-intl/server";

const NotFound = async () => {
  const locale = await getLocale();
  return <NotFoundContent locale={locale} />;
};

export default NotFound;
