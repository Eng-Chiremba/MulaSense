import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function EcocashServiceInfo() {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">EcoCash Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Send Money</p>
            <p className="text-sm text-muted-foreground">Transfer to EcoCash users</p>
          </div>
          <Badge variant="outline">USSD</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Buy Airtime</p>
            <p className="text-sm text-muted-foreground">Purchase airtime instantly</p>
          </div>
          <Badge variant="outline">USSD</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Pay Merchant</p>
            <p className="text-sm text-muted-foreground">Pay to merchant codes</p>
          </div>
          <Badge>API</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
