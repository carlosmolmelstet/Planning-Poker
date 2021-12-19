import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Home } from "main/interface/pages/Home";
import { NewRoom } from "main/interface/pages/NewRoom";
import { RoomOwner } from 'main/interface/pages/RoomOwner';
import { Room } from 'main/interface/pages/Room';
import { AuthContextProvider } from 'data/contexts/AuthContext';
import theme from 'main/designSystem/theme';

function Router() {
    return (
        <BrowserRouter>
            <ChakraProvider theme={theme}>
                <AuthContextProvider>
                        <Switch>
                            <Route path="/" exact component={Home} />
                            <Route path="/rooms/new" component={NewRoom} />
                            <Route path="/rooms/:id" component={Room} />
                            <Route path="/admin/rooms/:id" component={RoomOwner} />
                        </Switch>
                </AuthContextProvider>
            </ChakraProvider>
        </BrowserRouter>
    )
}

export default Router
