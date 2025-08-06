import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import Logo from "../../assets/logo.svg"
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu';
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { logout } from '@/services/firebase-auth';
import { isAuthenticated } from '@/auth-provider';

export const Route = createFileRoute('/(authenticated)')({
  beforeLoad: ({ location }) => {
      if (!isAuthenticated) {
        throw redirect({
          to: '/login',
          search: { redirect: location.href },
        });
      }
    },
    component: () => <div className='flex flex-col'>
      <header className='bg-white h-18 border-b border-gray-300 flex justify-between p-4'>
        <div className='h-full flex gap-1 flex-row items-center'>
          <img src={Logo} className='h-full'/>
          <p className='font-bold text-xl'>Dashiar</p>
        </div>
        <Menu
          menuButton={<MenuButton className={"px-4 cursor-pointer w-15  h-full rounded-full bg-white hover:brightness-80 flex justify-center items-center"}><FaUser/></MenuButton>}>
          <MenuItem 
            onMouseDown={() => logout()}
            className="bg-white px-5  flex gap-2 items-center p-2 rounded cursor-pointer border border-gray-300 hover:brightness-80">
            <FiLogOut />
            <p>Logout</p>
          </MenuItem>
        </Menu>
      </header>
      <Outlet />
    </div>,
})  
