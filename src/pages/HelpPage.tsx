import { Card, CardContent } from '@/components/ui/card'
import { Globe, Mail, MessageCircleMore } from 'lucide-react'

const HelpPage = () => {
    const contactLinks = [
        {
            label: 'WhatsApp',
            href: 'https://wa.me/+5555996450829?text=Ol%C3%A1,%20gostaria%20de%20falar%20sobre%20o%20sistema%20de%20gerenciamento.',
            text: 'Falar no WhatsApp',
            icon: MessageCircleMore,
        },
        {
            label: 'Email',
            href: 'mailto:cristian.rosa.@db.tec.br',
            text: 'Mande seu email',
            icon: Mail,
        },
        {
            label: 'LinkedIn',
            href: 'https://www.linkedin.com/in/cristiandutkercz',
            text: 'LinkedIn Cristian',
            icon: Globe,
        },
    ]

    return (
        <div className='flex min-h-screen items-center justify-center bg-background p-4 md:p-8'>
            <Card className='w-full max-w-4xl overflow-hidden border border-border/60 shadow-sm'>
                <div className='border-b bg-muted/30 px-6 py-8 text-center'>
                    <p className='text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground'>Suporte</p>
                    <h1 className='mt-3 text-3xl font-bold tracking-tight'>Precisa de ajuda com o sistema?</h1>
                </div>

                <CardContent className='space-y-6 p-6 md:p-8'>
                    <div className='rounded-2xl border border-border bg-card p-5 text-center md:p-6'>
                        <h2 className='text-xl font-semibold'>Fale com o desenvolvedor</h2>
                        <p className='mt-2 text-sm text-muted-foreground'>Você pode entrar em contato pelos canais abaixo:</p>
                    </div>

                    <div className='grid gap-4 md:grid-cols-3'>
                        {contactLinks.map(({ label, href, text, icon: Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target={href.startsWith('http') ? '_blank' : undefined}
                                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className='group rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm'
                            >
                                <div className='mb-3 gap-3 inline-flex rounded-xl bg-primary/10 p-2 text-primary'>
                                    <Icon className='h-5 w-5' />
                                    <p className='text-sm font-medium text-muted-foreground'>{label}</p>
                                </div>
                                <p className='mt-2 text-base font-semibold text-foreground group-hover:text-primary'>{text}</p>
                            </a>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default HelpPage