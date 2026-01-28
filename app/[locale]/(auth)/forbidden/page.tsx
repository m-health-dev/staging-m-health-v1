import ForbiddenContent from "@/components/utility/ForbiddenContent";
import { getLocale } from "next-intl/server";

const Forbidden = async () => {
  const locale = await getLocale();
  return <ForbiddenContent locale={locale} />;
};

export default Forbidden;
