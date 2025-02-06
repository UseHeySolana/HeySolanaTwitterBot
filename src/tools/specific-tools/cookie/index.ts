import { COOKIE_BASE, COOKIE_KEY } from "../../.."
import { request } from "../../../db"

const getAgentByUsername = async (username: string) => {
    const headers = new Headers({
        "x-api-key": COOKIE_KEY
    })
    const response = await request.get(`${COOKIE_BASE}/twitterUsername/${username}?interval=_7Days`, headers)
    const data = await response.json()
    return data
}

const getAgentByCA = async (ca: string) => {
    const headers = new Headers({
        "x-api-key": COOKIE_KEY
    })
    const response = await request.get(`${COOKIE_BASE}/contractAddress/${ca}?interval=_7Days`, headers)
    const data = await response.json()
    return data
}


export {
    getAgentByCA,
    getAgentByUsername
}