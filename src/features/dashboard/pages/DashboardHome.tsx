import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hey Emjay 👋 here's what's happing on your store today
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Best Selling Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Sterling Bottle</div>
            <p className="text-xs text-muted-foreground">
              300 Units Sold in the last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">500</div>
            <p className="text-xs text-muted-foreground">
              Items are in the inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Purchased day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Friday</div>
            <p className="text-xs text-muted-foreground">
              300 Products sold on Friday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Products out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Toothpaste</div>
            <p className="text-xs text-muted-foreground">
              0 units in the inventory
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Products grid will be implemented in Phase 2
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
