"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Box,
  AlertCircle,
  Info,
  Edit2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import {
  Bar,
  BarChart,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>["dashboard"];

const SALES_API_URL = "https://sales-analytics-api-508329185712.us-central1.run.app";

interface SalesOverview {
  period: {
    start_date: string;
    end_date: string;
    days: number;
  };
  metrics: {
    total_gmv: number;
    total_orders: number;
    average_order_value: number;
    gmv_growth_percent: number;
    orders_growth_percent: number;
  };
  top_products: Record<string, number>;
  regional_breakdown: Record<string, number>;
  daily_sales: Record<string, number>;
  ai_insights: string;
  generated_at: string;
}

interface InventoryStatus {
  summary: {
    total_products: number;
    total_stock_value: number;
    out_of_stock: number;
    critical_low_stock: number;
    low_stock: number;
    healthy_stock: number;
    overstocked: number;
  };
  stock_alerts: {
    out_of_stock: Array<any>;
    critical_low: Array<any>;
    low_stock: Array<any>;
    overstock: Array<any>;
  };
  category_breakdown: Record<string, number>;
  ai_recommendations: string;
  generated_at: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  stock_quantity: number;
  reorder_point: number;
  price: number;
}

interface ProductsResponse {
  products: Product[];
  total_count: number;
}

interface RevenueForecast {
  forecast_period: {
    start_date: string;
    end_date: string;
    days: number;
  };
  predictions: {
    predicted_gmv: number;
    predicted_daily_avg: number;
    confidence_level: string;
    growth_rate: number;
  };
  historical_baseline: {
    avg_daily_revenue: number;
    total_historical_orders: number;
    analysis_period_days: number;
  };
  ai_analysis: string;
  generated_at: string;
}

export function SalesAnalytics({ dictionary }: { dictionary: Dictionary }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState<SalesOverview | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryStatus | null>(null);
  const [forecastData, setForecastData] = useState<RevenueForecast | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [days, setDays] = useState(30);
  
  // Inventory management states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    stock_quantity: 0,
    reorder_point: 0,
    price: 0,
  });
  const { toast } = useToast();

  // Fetch sales overview
  const fetchSalesOverview = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SALES_API_URL}/api/analytics/sales-overview?days=${days}`);
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch inventory status
  const fetchInventoryStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SALES_API_URL}/api/inventory/status`);
      const data = await response.json();
      setInventoryData(data);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all products
  const fetchAllProducts = async () => {
    try {
      const response = await fetch(`${SALES_API_URL}/api/inventory/products`);
      const data: ProductsResponse = await response.json();
      setAllProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch revenue forecast
  const fetchRevenueForecast = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SALES_API_URL}/api/analytics/forecast?days_ahead=30`);
      const data = await response.json();
      setForecastData(data);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new product to inventory
  const handleAddProduct = async () => {
    try {
      const response = await fetch(`${SALES_API_URL}/api/inventory/add-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      
      if (response.ok) {
        toast({
          title: "Product Added!",
          description: `${newProduct.name} has been added to inventory.`,
        });
        setIsAddingProduct(false);
        setNewProduct({ name: "", category: "", stock_quantity: 0, reorder_point: 0, price: 0 });
        fetchInventoryStatus();
        fetchAllProducts();
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add product. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update existing product stock
  const handleUpdateStock = async (productName: string, newQuantity: number) => {
    try {
      const response = await fetch(`${SALES_API_URL}/api/inventory/update-stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_name: productName, new_quantity: newQuantity }),
      });
      
      if (response.ok) {
        toast({
          title: "Stock Updated!",
          description: `${productName} stock has been updated to ${newQuantity} units.`,
        });
        setEditingProduct(null);
        fetchInventoryStatus();
        fetchAllProducts();
      } else {
        throw new Error("Failed to update stock");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string, productName: string) => {
    try {
      const response = await fetch(`${SALES_API_URL}/api/inventory/delete-product/${productId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        toast({
          title: "Product Deleted!",
          description: `${productName} has been removed from inventory.`,
        });
        fetchInventoryStatus();
        fetchAllProducts();
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Initial load
  useEffect(() => {
    fetchSalesOverview();
    fetchInventoryStatus();
    fetchRevenueForecast();
    fetchAllProducts();
  }, [days]);

  // Convert daily sales to chart data
  const dailySalesChartData = salesData?.daily_sales
    ? Object.entries(salesData.daily_sales).map(([date, sales]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: sales,
      }))
    : [];

  // Convert top products to chart data
  const topProductsChartData = salesData?.top_products
    ? Object.entries(salesData.top_products)
        .slice(0, 5)
        .map(([product, quantity]) => ({
          product: product.substring(0, 15) + '...',
          quantity: quantity,
        }))
    : [];

  return (
    <div className="space-y-6">
      <Card className="bg-card/60 backdrop-blur-lg border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <LineChart className="text-primary" />
                <span className="font-headline">{dictionary.salesAnalytics.title}</span>
              </CardTitle>
              <CardDescription>{dictionary.salesAnalytics.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  fetchSalesOverview();
                  fetchInventoryStatus();
                  fetchRevenueForecast();
                  fetchAllProducts();
                }}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                Sales Overview
              </TabsTrigger>
              <TabsTrigger value="inventory">
                <Package className="h-4 w-4 mr-2" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="forecast">
                <TrendingUp className="h-4 w-4 mr-2" />
                Forecast
              </TabsTrigger>
            </TabsList>

            {/* Sales Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total GMV</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₹{salesData?.metrics.total_gmv.toLocaleString() || 0}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      {salesData?.metrics.gmv_growth_percent > 0 ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-green-500">
                            {salesData?.metrics.gmv_growth_percent.toFixed(1)}%
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                          <span className="text-red-500">
                            {salesData?.metrics.gmv_growth_percent.toFixed(1)}%
                          </span>
                        </>
                      )}
                      <span className="ml-1">from last period</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {salesData?.metrics.total_orders.toLocaleString() || 0}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      {salesData?.metrics.orders_growth_percent > 0 ? (
                        <>
                          <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                          <span className="text-green-500">
                            {salesData?.metrics.orders_growth_percent.toFixed(1)}%
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                          <span className="text-red-500">
                            {salesData?.metrics.orders_growth_percent.toFixed(1)}%
                          </span>
                        </>
                      )}
                      <span className="ml-1">from last period</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₹{salesData?.metrics.average_order_value.toFixed(2) || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Period</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{days} Days</div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant={days === 7 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDays(7)}
                      >
                        7d
                      </Button>
                      <Button
                        variant={days === 30 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDays(30)}
                      >
                        30d
                      </Button>
                      <Button
                        variant={days === 90 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDays(90)}
                      >
                        90d
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Daily Sales Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Daily Sales Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      {dailySalesChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart data={dailySalesChartData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis
                              dataKey="date"
                              stroke="#888888"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="#888888"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                borderColor: "hsl(var(--border))",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="sales"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              dot={{ fill: "hsl(var(--primary))" }}
                            />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No sales data available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Products Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      {topProductsChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={topProductsChartData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis
                              dataKey="product"
                              stroke="#888888"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              stroke="#888888"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                borderColor: "hsl(var(--border))",
                              }}
                            />
                            <Bar
                              dataKey="quantity"
                              fill="hsl(var(--primary))"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No product data available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* AI Insights */}
              {salesData?.ai_insights && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      AI-Powered Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                        {salesData.ai_insights}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-4">
              {/* Inventory Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Box className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {inventoryData?.summary?.total_products || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ₹{inventoryData?.summary?.total_stock_value?.toLocaleString() || 0} value
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-red-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">
                      {inventoryData?.summary?.out_of_stock || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Immediate attention</p>
                  </CardContent>
                </Card>

                <Card className="border-orange-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Critical Low</CardTitle>
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-500">
                      {inventoryData?.summary?.critical_low_stock || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Restock urgently</p>
                  </CardContent>
                </Card>

                <Card className="border-green-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Healthy Stock</CardTitle>
                    <Package className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                      {inventoryData?.summary?.healthy_stock || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Optimal levels</p>
                  </CardContent>
                </Card>
              </div>

              {/* Stock Alerts */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Stock Alerts</CardTitle>
                    <CardDescription>Products requiring immediate attention</CardDescription>
                  </div>
                  <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                          Add a new product to your inventory
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Product Name</Label>
                          <Input
                            id="name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            placeholder="Handmade Silk Scarf"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            placeholder="Textiles"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="stock">Stock Quantity</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stock_quantity}
                            onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: parseInt(e.target.value) || 0 })}
                            placeholder="50"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="reorder">Reorder Point</Label>
                          <Input
                            id="reorder"
                            type="number"
                            value={newProduct.reorder_point}
                            onChange={(e) => setNewProduct({ ...newProduct, reorder_point: parseInt(e.target.value) || 0 })}
                            placeholder="10"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="price">Price (₹)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                            placeholder="2500"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddProduct}>
                          <Save className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inventoryData?.stock_alerts?.out_of_stock?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive">Out of Stock</Badge>
                        <span className="text-sm text-muted-foreground">
                          {inventoryData.stock_alerts.out_of_stock.length} items
                        </span>
                      </div>
                      <div className="space-y-2">
                        {inventoryData.stock_alerts.out_of_stock.slice(0, 3).map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20"
                          >
                            <span className="text-sm">{item.name}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Update Stock: {item.name}</DialogTitle>
                                    <DialogDescription>
                                      Enter the new stock quantity
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor={`stock-${idx}`}>New Stock Quantity</Label>
                                      <Input
                                        id={`stock-${idx}`}
                                        type="number"
                                        placeholder="Enter quantity"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            const value = parseInt((e.target as HTMLInputElement).value);
                                            if (value >= 0) handleUpdateStock(item.name, value);
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button 
                                      onClick={() => {
                                        const input = document.getElementById(`stock-${idx}`) as HTMLInputElement;
                                        const value = parseInt(input.value);
                                        if (value >= 0) handleUpdateStock(item.name, value);
                                      }}
                                    >
                                      <Save className="h-4 w-4 mr-2" />
                                      Update Stock
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {inventoryData?.stock_alerts?.critical_low?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="default" className="bg-orange-500">
                          Critical Low
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {inventoryData.stock_alerts.critical_low.length} items
                        </span>
                      </div>
                      <div className="space-y-2">
                        {inventoryData.stock_alerts.critical_low.slice(0, 3).map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10 border border-orange-500/20"
                          >
                            <div>
                              <p className="text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.days_of_stock?.toFixed(1)} days remaining
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {item.stock_quantity} units
                              </Badge>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Update Stock: {item.name}</DialogTitle>
                                    <DialogDescription>
                                      Current stock: {item.stock_quantity} units ({item.days_of_stock?.toFixed(1)} days remaining)
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor={`critical-stock-${idx}`}>New Stock Quantity</Label>
                                      <Input
                                        id={`critical-stock-${idx}`}
                                        type="number"
                                        defaultValue={item.stock_quantity}
                                        placeholder="Enter quantity"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            const value = parseInt((e.target as HTMLInputElement).value);
                                            if (value >= 0) handleUpdateStock(item.name, value);
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button 
                                      onClick={() => {
                                        const input = document.getElementById(`critical-stock-${idx}`) as HTMLInputElement;
                                        const value = parseInt(input.value);
                                        if (value >= 0) handleUpdateStock(item.name, value);
                                      }}
                                    >
                                      <Save className="h-4 w-4 mr-2" />
                                      Update Stock
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!inventoryData?.stock_alerts?.out_of_stock?.length &&
                    !inventoryData?.stock_alerts?.critical_low?.length) && (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <div className="text-center">
                        <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No critical alerts</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* All Products List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    All Products
                  </CardTitle>
                  <CardDescription>
                    {allProducts.length} products in inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {allProducts.length > 0 ? (
                      allProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border hover:bg-muted/80 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{product.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span>Stock: {product.stock_quantity} units</span>
                              <span>Price: ₹{product.price.toLocaleString()}</span>
                              <span>Reorder at: {product.reorder_point}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setEditQuantity(product.stock_quantity);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Update Stock: {product.name}</DialogTitle>
                                <DialogDescription>
                                  Current stock: {product.stock_quantity} units
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor={`edit-stock-${product.id}`}>New Stock Quantity</Label>
                                  <Input
                                    id={`edit-stock-${product.id}`}
                                    type="number"
                                    value={editQuantity}
                                    onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                                    placeholder="Enter quantity"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && editQuantity >= 0) {
                                        handleUpdateStock(product.name, editQuantity);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  onClick={() => {
                                    if (editQuantity >= 0) {
                                      handleUpdateStock(product.name, editQuantity);
                                    }
                                  }}
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Update Stock
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground">
                        <div className="text-center">
                          <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No products found</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => setIsAddingProduct(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Product
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Forecast Tab */}
            <TabsContent value="forecast" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Predicted GMV</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₹{forecastData?.predictions?.predicted_gmv?.toLocaleString() || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {forecastData?.predictions?.confidence_level || 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on {forecastData?.historical_baseline?.total_historical_orders || 0} orders
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                    {forecastData?.predictions?.growth_rate > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${forecastData?.predictions?.growth_rate > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {forecastData?.predictions?.growth_rate?.toFixed(1) || 0}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Trend direction</p>
                  </CardContent>
                </Card>
              </div>

              {/* AI Forecast Analysis */}
              {forecastData?.ai_analysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Forecast Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                        {forecastData.ai_analysis}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
