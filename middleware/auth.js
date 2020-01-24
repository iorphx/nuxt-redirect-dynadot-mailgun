import axios from 'axios'

async function getRoute(url) {
  return axios.get(url)
    .then(res => {
      return res.data.to
    })
}

export default async function ({ store, redirect, route, error }) {
  if (store.state.authUser) if (route.name === 'login' || route.path ===  '/') return redirect('/redirect')
  let RouteInfo = await getRoute(`http://poppin.party/api/route${route.path}`)
  if (RouteInfo) return redirect(RouteInfo)
  else if (!store.state.authUser) return redirect('/login')
}
