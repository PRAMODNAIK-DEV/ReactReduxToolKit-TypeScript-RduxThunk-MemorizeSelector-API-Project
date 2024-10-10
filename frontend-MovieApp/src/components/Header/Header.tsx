import {BsSun, BsFillMoonFill} from 'react-icons/bs'
import { useSelector } from 'react-redux'
import {toggleTheme} from '../../features/theme/themeSlice';
import {RootStateType} from '../../store'
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';

const Header = () => {

    const dispatch = useAppDispatch();

    const isDarkTheme = useAppSelector((currentState: RootStateType) => currentState.darkTheme);       // Here useSelector will fetch state of all the slices in the store but we want a slice with key darkTheme.
    // const {isDarkTheme} = useSelector((currentState: RootStateType) => currentState); //This is using object destructureing.
    // console.log("themeState", isDarkTheme);

    const onToggle = () =>{
        dispatch(toggleTheme());
    }

  return (
    <header className='mb-20'>
        <nav className='border-b border-gray-200 border-opacity-25 py-2.5'>
            <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl'>
                <a href="#!" className='flex items-center'>
                    <span className='slef-center text-xl font-semibold whitespace-nowrap'>
                        Movies

                    </span>
                </a>

                <div className='flex items-center lg:order-2'>
                    {isDarkTheme && <BsSun onClick={onToggle} className='hover:opacity-50 cursor-pointer'/>}
                    {!isDarkTheme && <BsFillMoonFill onClick={onToggle} className='hover:opacity-50 cursor-pointer'/>}
                </div>

            </div>

        </nav>
    </header>
  )
}

export default Header