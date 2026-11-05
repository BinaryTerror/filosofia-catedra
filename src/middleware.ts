import { NextResponse, type NextRequest } from 'next/server'
export function middleware(req:NextRequest) {
 // O primeiro administrador é criado por um comando privado, nunca por visitantes.
 if (req.nextUrl.pathname.includes('first-register') || req.nextUrl.pathname.includes('create-first-user'))
   return new NextResponse('Configuração reservada ao responsável técnico.',{status:403})
 if (process.env.DEMO_MODE==='true')
   return new NextResponse('O painel requer ligação ao Supabase. Esta é uma demonstração visual.',{status:503})
 return NextResponse.next()
}
export const config={matcher:['/admin/:path*','/api/:path*']}
