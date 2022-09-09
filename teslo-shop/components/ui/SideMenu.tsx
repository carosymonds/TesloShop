import { Box, Button, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { AuthContext, UIContext } from "../../context";
import { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";


export const SideMenu = () => {

    const { isMenuOpen, toggleSideMenu  } = useContext(UIContext);

    const { isLoggedIn, logoutUser } = useContext(AuthContext);

    const router = useRouter();

    const navigateTo = ( url: string ) => {
        toggleSideMenu();
        router.push(url);
    }

    const [searchTerm, setSearchTerm] = useState('');

    const searchData = () => {
        navigateTo(`/search/${searchTerm}`)
        toggleSideMenu();
    }
    

    return (
        <Drawer
            open={ isMenuOpen }
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
            onClose={ toggleSideMenu }
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>
                
                <List>

                    <ListItem>
                        <Input
                            type='text'
                            placeholder="Buscar..."
                            onChange={(e)=>setSearchTerm(e.target.value)}
                            onKeyPress={(e) => searchData()}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => searchData()}
                                    >
                                    <SearchOutlined 
                                        
                                    />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <AccountCircleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Perfil'} />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <ConfirmationNumberOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Mis Ordenes'} />
                    </ListItem>


                    <ListItem button >
                        <ListItemIcon>
                            <MaleOutlined/>
                        </ListItemIcon>

                        <ListItemText onClick={() => navigateTo('/category/men')} primary={'Hombres'} />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <FemaleOutlined/>
                        </ListItemIcon>
                        <ListItemText  onClick={() => navigateTo('/category/women')}  primary={'Mujeres'} />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <EscalatorWarningOutlined/>
                        </ListItemIcon>
                        <ListItemText  primary={'Niños'} />
                    </ListItem>


                    {isLoggedIn ? <ListItem button onClick={logoutUser}>
                        <ListItemIcon>
                            <LoginOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Salir'} />
                    </ListItem> :  
                    <ListItem button  onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}>
                        <ListItemIcon>
                            <VpnKeyOutlined/>
                        </ListItemIcon>
                        <ListItemText  primary={'Ingresar'} />
                    </ListItem>}

                    


                    {/* Admin */}
                    <Divider />
                    {isLoggedIn ? <ListSubheader>Admin Panel</ListSubheader> : ''}

                    <ListItem button>
                        <ListItemIcon>
                            <CategoryOutlined/>
                        </ListItemIcon>
                        <ListItemText  onClick={() => navigateTo('/admin/products')}  primary={'Productos'} />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <ConfirmationNumberOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Ordenes'} />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <AdminPanelSettings/>
                        </ListItemIcon>
                        <ListItemText primary={'Usuarios'} />
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    )
    }