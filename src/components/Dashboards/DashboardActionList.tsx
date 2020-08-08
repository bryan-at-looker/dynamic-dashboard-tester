import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { ActionListItemColumn, ActionListItem, ActionList, doDefaultActionListSort, InputSearch } from '@looker/components';
import { filter, sortBy } from 'lodash';
import { DASHBOARD_SEARCH_FIELDS } from '../../Main';
import { useHistory } from 'react-router-dom';

const COLUMNS = [
  {
    id: 'id',
    primaryKey: true,
    title: 'ID',
    type: 'number',
    canSort: true,
    widthPercent: 10
  },
  {
    id: 'title',
    title: 'Title',
    canSort: true,
    sortDirection: 'asc',
    widthPercent: 25,
    type: 'string',
  },
  {
    id: 'description',
    title: 'Description',
    canSort: false,
    widthPercent: 50,
    type: 'string',
  },
  {
    id: 'folder.name',
    title: 'Folder',
    canSort: false,
    widthPercent: 15,
    type: 'string',
  }
]

export function DashboardActionList({ type, all_dashboards, all_favorites, user }: any) {

  const [keywords, setKeywords] = useState('')
  const [dashboards, setDashboards] = useState<any>();
  const [columns, setColumns] = useState(COLUMNS);
  const [loading, setLoading] = useState(true);

  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.core40SDK
  let history = useHistory();

  useEffect(()=>{
    if (type === 'favorites' ) {
      if (all_favorites?.dashboards) {
        setDashboards(all_favorites.dashboards)
      } else {
        setDashboards([])
      }
      setLoading(false)
    } else if (type === 'recently_viewed') {
      getRecentlyViewed();
    } else {
      setDashboards(all_dashboards)
      setLoading(false)
    }
  }, [all_favorites, all_dashboards])

  

  const getRecentlyViewed = async () => {
    const db_list = await sdk.ok(sdk.search_dashboards({
      last_viewed_at: 'not null',
      sorts: 'last_viewed_at desc',
      deleted: 'false',
      limit: 25,
      fields: DASHBOARD_SEARCH_FIELDS
    }))
    setDashboards(sortBy(db_list, ['title','id'])) 
    setLoading(false)
  } 

  const onChange = (e: any) => {
    setKeywords(e.currentTarget.value)
  }

  const onSort = (id: string | number, sortDirection: string) => {
    const {
      columns: sortedColumns,
      data: sortedDashboards,
      //@ts-ignore
    } = doDefaultActionListSort(dashboards, columns, id, sortDirection)
    setDashboards(sortedDashboards)
    //@ts-ignore
    setColumns(sortedColumns)
  }
  let dbs: any = []
  if (type === 'favorites') {
    dbs = dashboards
  } else if (type === 'shared') {
    dbs = filter(dashboards, o=>{return !(o.folder.is_personal_descendant || o.folder.is_personal)})
  } else if ( type === 'my_personal') {
    dbs = filter(dashboards, o=>{return ((o.folder.is_personal_descendant || o.folder.is_personal) && user.id === o.user_id)})
  } else if ( type === 'other_personal') {
    dbs = filter(dashboards, o=>{return ((o.folder.is_personal_descendant || o.folder.is_personal) && user.id !== o.user_id)})
  } else {
    dbs = dashboards
  }


  dbs = filter(dbs, o=>{return o.title.toLowerCase().indexOf(keywords.toLowerCase()) > -1 })
  
  const Items = () => {
    return dbs.map(({ id, title, description, folder }: any) => {
      
      return (
        <ActionListItem
          id={id}
          key={id}
          onClick={() => {
            history.push(`/dashboards/${id}`)
          }}
        >
          <ActionListItemColumn>{id}</ActionListItemColumn>
          <ActionListItemColumn>{title}</ActionListItemColumn>
          <ActionListItemColumn>{description}</ActionListItemColumn>
          <ActionListItemColumn>{folder.name}</ActionListItemColumn>
        </ActionListItem>
      )
    })
  } 

    return (
      <>
        <InputSearch
          placeholder="Search Titles"
          hideControls
          value={keywords}
          onChange={onChange}
      />
      <ActionList 
        onSort={onSort} 
        // @ts-ignore
        columns={columns}
        loading={loading}
      >
        <Items/>
      </ActionList>
      </>
    )
}