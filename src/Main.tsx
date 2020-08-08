import React, { useEffect, useState, useContext } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Box, ComponentsProvider, Spinner } from '@looker/components'
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'
import { DynamicTester } from './DynamicTester'
import { IDashboardBase } from '@looker/sdk/lib/sdk/3.1/models'
import { DashboardTabs } from './components/Dashboards/DashboardTabs'
import { filter } from 'lodash'

export const DASHBOARD_SEARCH_FIELDS = 'id,title,description,folder'

export const Main = ({ route, routeState, }: any) => {

  const [all_dashboards, setAllDashboards] = useState<IDashboardBase[] | undefined >()
  const [all_favorites, setAllFavorites] = useState<any | undefined>()
  const [user, setUser] = useState<any | undefined>()
  const [ready, setReady] = useState(false)

  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK

  useEffect(() => {
    getDashboards();
    getAllFavorites();
  }, [])

  useEffect(()=>{
    if (all_dashboards && all_favorites && user) {
      setReady(true)
    }
  },[all_dashboards, all_favorites, user])

  const getDashboards = async () => {
    const dbs = await sdk.ok(sdk.all_dashboards(DASHBOARD_SEARCH_FIELDS));
    setAllDashboards(dbs);
  }

  const getAllFavorites = async () => {
    const me = await sdk.ok(sdk.me())
    setUser(me)
    const favorites = await sdk.ok(sdk.search_content_favorites({
      user_id: String(me!.id),
      fields: 'dashboard_id'
    }))
    const dbs = filter(favorites, function(c){ return c.dashboard_id })
    let db_list: any = []

    if (dbs.length) {
      db_list = await sdk.ok(sdk.search_dashboards({
        //@ts-ignore
        id: dbs.map(d=>{return String(d.dashboard_id!)}).join(','),
        fields: DASHBOARD_SEARCH_FIELDS
      }))
    } 
    setAllFavorites({dashboards: db_list})
  } 

  return (
    <>
      <ComponentsProvider>
          <Box>
            <Switch>
                <Route path="/dashboards/:dashboard_id">
                  <DynamicTester />
                </Route>
                <Route path="/">
                  {(ready) ? 
                    <DashboardTabs {...{all_dashboards, all_favorites, user}} /> :
                    <Spinner/>
                  }
                </Route>
                <Redirect to="/" />
            </Switch>
          </Box>
      </ComponentsProvider>
    </>
  )
}