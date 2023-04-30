import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "./Link";

import Drawer from "@mui/material/Drawer";

import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";

import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import theme from "@/theme";
import SearchRounded from "@mui/icons-material/SearchRounded";
import CompareOutlined from "@mui/icons-material/CompareOutlined";

import { useRouter } from "next/router";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
const drawerWidth = 240;

const routes: {
  name: string;
  path: string;
  icon: JSX.Element;
}[] = [
  {
    name: "Keyword Analysis",
    path: "/dashboard",
    icon: <SearchRounded />,
  },
  {
    name: "Realtime Trend",
    path: "/dashboard/trend",
    icon: <TrendingUpIcon />,
  },
  {
    name: "Weekly Trend",
    path: "/dashboard/weekly",
    icon: <CompareOutlined />,
  },
];

function MainLayout({ children }: React.PropsWithChildren) {
  return <Layout>{children}</Layout>;
}

export default MainLayout;

export function Layout({ children }: React.PropsWithChildren) {
  const router = useRouter();
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Trendyy
          </Typography>

          <Button variant="outlined" sx={{ mx: 1, my: 1 }}>
            <Link href="/" variant="button" sx={{ textDecoration: "none" }}>
              Go to Home
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            paddingTop: "4rem",
          },
        }}
      >
        {routes.map(({ name, path, icon }) => (
          <ListItem key={name} disablePadding>
            <Link
              href={path}
              sx={{
                textDecoration: "none",
                color: theme.palette.text.primary,
                width: "100%",
              }}
            >
              <ListItemButton selected={path === router.pathname}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </Drawer>
      <Box
        component="div"
        sx={{
          flex: 1,
          flexDirection: "row",
          paddingTop: "4.5rem",
          paddingLeft: "1rem",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
