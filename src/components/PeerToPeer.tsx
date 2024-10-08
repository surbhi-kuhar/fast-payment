import { Card } from "@/ui/src/card"

export const PeerToPeer = ({
    transactions,
    text
}: {
    transactions: {
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        status: string,
        provider: string
    }[],
    text:string
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Mobile Phone Recent Transactions">
        <div className="pt-2">
            {transactions.map(t => <div className="flex justify-between" key={t.time.toDateString()}>
                <div>
                    <div className="text-sm">
                        {text}
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    + Rs {t.amount / 100}
                </div>
            </div>)}
        </div>
    </Card>
}