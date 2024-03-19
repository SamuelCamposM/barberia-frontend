import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";

export const MigasDePan = () => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" color="inherit" href="/">
        MUI
      </Link>
      <Link underline="hover" color="inherit">
        Core
      </Link>
      <Link underline="hover" color="text.primary" aria-current="page">
        Breadcrumbs
      </Link>
    </Breadcrumbs>
  );
};
