import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { Connection } from "mongoose"

declare global{
    var mongoose:{
        conn:Connection | null,
        promise:Promise<Connection> | null
    }
}

export {}