import Login from "../pages/Authentication/Login";

import Profile from "../pages/Establishment/Profile";
import ProfileForm from "../pages/Establishment/Profile/ProfileForm";
import Services from "../pages/Establishment/Services";
import ServiceForm from "../pages/Establishment/Services/ServiceForm";
import Messages from "../pages/Establishment/Chat";
import SocialUpdate from "../pages/Establishment/SocialUpdate";
import Settings from "../pages/Establishment/Settings";

import Reports from '../pages/Admin/Reports';
import Users from '../pages/Admin/Users';
import BusinessAccounts from '../pages/Admin/BusinessAccounts';
import Pricing from '../pages/Admin/Pricing';
import ChangePwd from '../pages/Admin/ChangePwd';

const publicRoutes = [
  { path: "/", exact: true, component: Login },  
	{ path: "/login", component: Login },
];

const authProtectedRoutes = [	
	{ path: "/profile", exact: true, component: Profile },
	{ path: "/profile/edit", component: ProfileForm},
	{ path: "/services", exact: true, component: Services },
	{ path: "/services/add", exact: true, component: ServiceForm },
	{ path: "/services/edit", exact: true, component: ServiceForm },
	{ path: "/chat", component: Messages },
	{ path: "/socialupdate", component: SocialUpdate },
	{ path: "/settings", component: Settings },
];

const authProtectedAdminRoutes = [
	{ path: "/admin/reports", exact: true, component: Reports },
	{ path: "/admin/reports/detail", exact: true, component: Reports },
	{ path: "/admin/users/all", component: Users},
	{ path: "/admin/users/banned", component: Users},
	{ path: "/admin/pricing", exact: true, component: Pricing },
	{ path: "/admin/businessaccounts", exact: true, component: BusinessAccounts },
	{ path: "/admin/businessaccounts/requests", exact: true, component: BusinessAccounts },
	{ path: "/admin/businessaccounts/requests/detail", component: BusinessAccounts },
	{ path: "/admin/businessaccounts/view", component: BusinessAccounts },
	{ path: "/admin/changepwd", component: ChangePwd },
]

export { publicRoutes, authProtectedRoutes, authProtectedAdminRoutes };
