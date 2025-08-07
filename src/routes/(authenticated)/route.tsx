import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import Logo from "../../assets/logo.svg"
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { logout } from '@/services/firebase-auth';
import { isAuthenticated, useAuth } from '@/utils/providers/auth-provider';
import { FaChartPie } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";
import { useModal } from '@/utils/providers/modal';
import { PremiumPlanModal } from '@/components/PremiumPlanModal';

export const Route = createFileRoute('/(authenticated)')({
  beforeLoad: ({ location }) => {
      if (!isAuthenticated) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        });
      }
    },
    component: () => {

      const {show} = useModal()
      const auth = useAuth()

      return <div className='flex flex-col h-screen overflow-hidden'>
      <header className='bg-white h-18 border-b border-gray-300 flex justify-between p-4 z-100'>
        <Link to='/' className='h-full flex gap-1 flex-row items-center'>
            <img src={Logo} className='h-full'/>
            <p className='font-bold text-xl'>Dashiar</p>
        </Link>
        <Menu
          menuButton={<MenuButton className={"px-4 cursor-pointer w-15  h-full rounded-full bg-white hover:brightness-80 flex justify-center items-center"}><FaUser/></MenuButton>}>
          <MenuItem 
            className="bg-white px-5  flex gap-2 items-center p-2 rounded cursor-pointer border border-gray-300 hover:brightness-80 w-50">
            <Link to='/list' className='flex gap-2 items-center'>
              <FaChartPie />
              <p>My dashboards</p>
            </Link>
          </MenuItem>
          {
            !auth.subscriptions.some((subscription) => subscription.type === "premium")
              ?
              <MenuItem 
                onMouseDown={() => show(<PremiumPlanModal/>)}
                className="bg-white px-5  flex gap-2 items-center p-2 rounded cursor-pointer border border-gray-300 hover:brightness-80 w-50">
                <div className='flex gap-2 items-center'>
                  <FaLightbulb />
                  <p>Premium</p>
                </div>
              </MenuItem>
              :
              undefined
          }
          <MenuItem 
            onMouseDown={() => logout()}
            className="bg-white px-5  flex gap-2 items-center p-2 rounded cursor-pointer border border-gray-300 hover:brightness-80">
            <FiLogOut />
            <p>Logout</p>
          </MenuItem>
        </Menu>
      </header>
      <Outlet />
    </div>
    }
})  
