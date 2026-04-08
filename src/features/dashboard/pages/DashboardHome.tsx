import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Plus, Grid3x3, List, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { ProductTable } from '@/features/products/components/ProductTable';
import { FilterModal, FilterOptions } from '@/features/products/components/FilterModal';
import { SortMenu, SortOption } from '@/features/products/components/SortMenu';
import { Calendar } from '@/features/services/components/Calendar';
import { AppointmentModal } from '@/features/services/components/AppointmentModal';
import { AddServiceModal, ServiceFormData } from '@/features/services/components/AddServiceModal';
import { CreateOrderModal, OrderFormData } from '@/features/services/components/CreateOrderModal';
import { servicesApi, type ServiceStats, type ServiceCategory, type Appointment } from '@/shared/lib/services-mock-api';
import { useAdminBookings } from '@/features/services/hooks/useBookings';
import { Product } from '@/features/products/types/product.types';
import { Category } from '@/features/categories/types/category.types';
import { cn } from '@/shared/lib/utils';
import { useNavigate } from 'react-router-dom';

// Real-API hooks
import { useDashboard, useSalesByDay } from '@/features/analytics/hooks/useAnalytics';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useCategoryTree } from '@/features/categories/hooks/useCategories';

type ViewMode = 'grid' | 'list';
type TabMode = 'products' | 'services';

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState<TabMode>('products');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Search, Filter, Sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    stockStatus: 'all',
  });
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  // Services states
  const [serviceStats, setServiceStats] = useState<ServiceStats | null>(null);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string | null>(null);
  const [selectedServiceSubcategory, setSelectedServiceSubcategory] = useState<string | null>(null);
  const [expandedServiceCategory, setExpandedServiceCategory] = useState<string | null>('makeup');
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);

  const navigate = useNavigate();

  // ── Real API data ──────────────────────────────────────────────────
  const { data: dashboard, isLoading: dashboardLoading } = useDashboard();
  const { data: salesByDay } = useSalesByDay();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categoryTree, isLoading: categoriesLoading } = useCategoryTree();
  const { data: appointments = [] } = useAdminBookings();

  const isProductsTabLoading = dashboardLoading || productsLoading || categoriesLoading;

  // ── Derived stats for stat cards ────────────────────────────────────
  const bestSellingProduct = dashboard?.topProducts?.[0] ?? null;

  const mostPurchasedDay = useMemo(() => {
    if (!salesByDay?.length) return null;
    return salesByDay.reduce(
      (max, day) => (day.unitsSold > max.unitsSold ? day : max),
      salesByDay[0]
    );
  }, [salesByDay]);

  const outOfStockAlerts = useMemo(
    () => dashboard?.lowStockAlerts?.filter((a) => a.alertType === 'OUT_OF_STOCK') ?? [],
    [dashboard]
  );

  // ── Service tab: load stats + categories from mock; appointments come from real API ─────
  useEffect(() => {
    if (activeTab !== 'services') return;
    Promise.all([
      servicesApi.getServiceStats(),
      servicesApi.getServiceCategories(),
    ]).then(([stats, cats]) => {
      setServiceStats(stats);
      setServiceCategories(cats);
    });
  }, [activeTab]);

  // ── Products filtering ───────────────────────────────────────────────
  // Collect all child category IDs for the selected parent
  const childCategoryIds = useMemo(() => {
    if (!selectedCategory || !categoryTree) return new Set<string>();
    const parent = categoryTree.find((c) => c.id === selectedCategory);
    const childIds = (parent?.children ?? []).map((ch: Category) => ch.id);
    return new Set<string>(childIds);
  }, [selectedCategory, categoryTree]);

  const filteredProducts = useMemo(() => {
    let result = [...(products ?? [])];

    // Category filter (parent → include self + all children)
    if (selectedSubcategory) {
      result = result.filter((p) => p.categoryId === selectedSubcategory);
    } else if (selectedCategory) {
      result = result.filter(
        (p) => p.categoryId === selectedCategory || childCategoryIds.has(p.categoryId)
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query)
      );
    }

    // Advanced filters
    if (filterOptions.minPrice !== undefined) {
      result = result.filter((p) => p.basePrice >= filterOptions.minPrice!);
    }
    if (filterOptions.maxPrice !== undefined) {
      result = result.filter((p) => p.basePrice <= filterOptions.maxPrice!);
    }
    if (filterOptions.minStock !== undefined) {
      result = result.filter((p) => p.stockQuantity >= filterOptions.minStock!);
    }
    if (filterOptions.stockStatus && filterOptions.stockStatus !== 'all') {
      switch (filterOptions.stockStatus) {
        case 'in-stock':
          result = result.filter((p) => p.stockQuantity > 50);
          break;
        case 'low-stock':
          result = result.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 50);
          break;
        case 'out-of-stock':
          result = result.filter((p) => p.stockQuantity === 0);
          break;
      }
    }

    // Sort
    switch (sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'stock-asc':
        result.sort((a, b) => a.stockQuantity - b.stockQuantity);
        break;
      case 'stock-desc':
        result.sort((a, b) => b.stockQuantity - a.stockQuantity);
        break;
    }

    return result;
  }, [products, selectedCategory, selectedSubcategory, childCategoryIds, searchQuery, filterOptions, sortOption]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleSubcategoryClick = (subId: string, parentId: string) => {
    setSelectedCategory(parentId);
    setSelectedSubcategory(subId);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchQuery('');
    setFilterOptions({ stockStatus: 'all' });
    setSortOption('name-asc');
  };

  const hasActiveFilters = () =>
    Boolean(
      selectedCategory ||
        selectedSubcategory ||
        searchQuery.trim() ||
        filterOptions.minPrice !== undefined ||
        filterOptions.maxPrice !== undefined ||
        filterOptions.minStock !== undefined ||
        (filterOptions.stockStatus && filterOptions.stockStatus !== 'all')
    );

  // ── Service tab filtering ────────────────────────────────────────────
  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    if (selectedServiceCategory) {
      const categoryServiceMap: Record<string, string[]> = {
        makeup: ['Make Up'],
        nails: ['Nails'],
        hair: ['Hair'],
      };
      const serviceNames = categoryServiceMap[selectedServiceCategory] ?? [];
      result = result.filter((apt) => serviceNames.includes(apt.service));
    }

    if (serviceSearchQuery.trim()) {
      const query = serviceSearchQuery.toLowerCase();
      result = result.filter(
        (apt) =>
          apt.customerName.toLowerCase().includes(query) ||
          apt.service.toLowerCase().includes(query)
      );
    }

    return result;
  }, [appointments, selectedServiceCategory, serviceSearchQuery]);

  const handleServiceCategoryClick = (categoryId: string) => {
    setSelectedServiceCategory(categoryId);
    setSelectedServiceSubcategory(null);
    setExpandedServiceCategory(categoryId);
  };

  const handleServiceSubcategoryClick = (subcategory: string, categoryId: string) => {
    setSelectedServiceCategory(categoryId);
    setSelectedServiceSubcategory(subcategory);
  };

  const clearServiceFilters = () => {
    setSelectedServiceCategory(null);
    setSelectedServiceSubcategory(null);
    setServiceSearchQuery('');
  };

  const hasActiveServiceFilters = () =>
    Boolean(selectedServiceCategory || selectedServiceSubcategory || serviceSearchQuery.trim());

  const serviceDropdownOptions = useMemo(
    () => [
      { value: 'makeup', label: 'Make Up' },
      { value: 'nails', label: 'Nails' },
      { value: 'hair', label: 'Hair' },
    ],
    []
  );

  const subcategoryDropdownOptions = useMemo(() => {
    const all: { value: string; label: string }[] = [];
    serviceCategories.forEach((cat) => {
      cat.subcategories.forEach((sub) => {
        all.push({
          value: `${cat.id}-${sub.toLowerCase().replace(/\s+/g, '-')}`,
          label: `${cat.name} - ${sub}`,
        });
      });
    });
    return all;
  }, [serviceCategories]);

  const handleAddService = (data: ServiceFormData) => {
    console.log('Adding new service:', data);
    alert(`Service "${data.name}" created successfully!`);
  };

  const handleCreateOrder = (data: OrderFormData) => {
    console.log('Creating new order:', data);
    alert(`Order created for ${data.clientName} on ${data.date} at ${data.time}`);
  };

  // ── Helpers ─────────────────────────────────────────────────────────
  const getCategoryName = (id: string) =>
    (categoryTree ?? []).find((c) => c.id === id)?.name ??
    (categoryTree ?? [])
      .flatMap((c) => c.children ?? [])
      .find((ch: Category) => ch.id === id)?.name ??
    id;

  if (isProductsTabLoading && activeTab === 'products') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-l font-bold text-gray-900">
            Hey Emjay 👋{' '}
            <span className="text-sm font-normal text-gray-600">
              - here's what's happening on your store today
            </span>
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Best Selling Product"
            value={bestSellingProduct?.productName ?? '—'}
            subtitle={
              bestSellingProduct
                ? `${bestSellingProduct.unitsSold} Units Sold in the last month`
                : 'No data yet'
            }
            dropdown
            navigateTo="/analytics/most-purchased-products"
          />
          <StatCard
            label="Inventory Amount"
            value={products?.length ?? 0}
            subtitle="Items are in the inventory"
            dropdown
            navigateTo="/analytics/total-sales"
          />
          <StatCard
            label="Most Purchased Day"
            value={mostPurchasedDay?.dayName ?? '—'}
            subtitle={
              mostPurchasedDay
                ? `${mostPurchasedDay.unitsSold} Units Sold on ${mostPurchasedDay.dayName}`
                : 'No sales data yet'
            }
            dropdown
            navigateTo="/analytics/most-purchased-day"
          />
          <StatCard
            label="Products out of Stock"
            value={
              outOfStockAlerts.length > 0
                ? outOfStockAlerts[0].productName
                : `${dashboard?.lowStockAlerts?.length ?? 0} low-stock alerts`
            }
            subtitle={
              outOfStockAlerts.length > 0
                ? `${outOfStockAlerts.length} product(s) out of stock`
                : 'All products in stock'
            }
            navigateTo="/analytics/inventory"
          />
        </div>
      ) : (
        <div>
          {serviceStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Most Booked Service"
                value={serviceStats.mostBookedService.name}
                subtitle={`${serviceStats.mostBookedService.orders} Orders in the last month`}
                change={serviceStats.mostBookedService.change}
                dropdown
              />
              <StatCard
                label="Total Orders"
                value={serviceStats.totalOrders.count}
                subtitle="Orders in the last month"
                change={serviceStats.totalOrders.change}
                dropdown
              />
              <StatCard
                label="Most Booked Day"
                value={serviceStats.mostBookedDay.day}
                subtitle={`${serviceStats.mostBookedDay.orders} orders on ${serviceStats.mostBookedDay.day}`}
                change={serviceStats.mostBookedDay.change}
                dropdown
              />
              <StatCard
                label="Service with Lowest Orders"
                value={serviceStats.lowestOrders.name}
                subtitle={`${serviceStats.lowestOrders.orders} Orders`}
                change={serviceStats.lowestOrders.change}
              />
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('products')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'products'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          )}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'services'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          )}
        >
          Services
        </button>
      </div>

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <div className="flex gap-6">
          {/* Categories Sidebar — uses real category tree */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-1">
              <button
                onClick={clearFilters}
                className={cn(
                  'w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  !selectedCategory && !selectedSubcategory
                    ? 'bg-[#F5E6EC] text-primary border-r-4 border-primary'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                All Products
              </button>

              {(categoryTree ?? [])
                .filter((c) => !c.parentCategoryId) // only root categories
                .map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm font-semibold rounded-md flex items-center justify-between transition-colors',
                        selectedCategory === category.id && !selectedSubcategory
                          ? 'bg-[#F5E6EC] text-primary border-r-4 border-primary'
                          : 'text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      {category.name}
                      {(category.children?.length ?? 0) > 0 && (
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 transition-transform duration-200',
                            expandedCategory === category.id && 'rotate-180'
                          )}
                        />
                      )}
                    </button>

                    {expandedCategory === category.id &&
                      (category.children ?? []).map((child: Category) => (
                        <button
                          key={child.id}
                          onClick={() => handleSubcategoryClick(child.id, category.id)}
                          className={cn(
                            'block w-full text-left ml-4 px-4 py-2 text-sm rounded-md transition-colors',
                            selectedSubcategory === child.id && selectedCategory === category.id
                              ? 'bg-[#F5E6EC] text-primary font-medium'
                              : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                          )}
                        >
                          {child.name}
                        </button>
                      ))}
                  </div>
                ))}
            </div>
          </div>

          {/* Products Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                {hasActiveFilters() && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {selectedSubcategory
                        ? `Showing: ${getCategoryName(selectedSubcategory)}`
                        : selectedCategory
                        ? `Showing: ${getCategoryName(selectedCategory)}`
                        : searchQuery
                        ? `Search: "${searchQuery}"`
                        : 'Filtered'}
                    </span>
                    <button
                      onClick={clearFilters}
                      className="text-xs text-primary hover:text-primary/80 underline"
                    >
                      Clear All
                    </button>
                  </div>
                )}
                <span className="text-sm text-gray-500">
                  ({filteredProducts.length}{' '}
                  {filteredProducts.length === 1 ? 'product' : 'products'})
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center bg-white border border-gray-200 rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded-l-md transition-colors',
                      viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    )}
                    title="Grid view"
                  >
                    <Grid3x3 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded-r-md transition-colors',
                      viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    )}
                    title="List view"
                  >
                    <List className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-56"
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterModalOpen(true)}
                    className={cn(
                      filterOptions.minPrice !== undefined ||
                        filterOptions.maxPrice !== undefined ||
                        filterOptions.minStock !== undefined ||
                        (filterOptions.stockStatus && filterOptions.stockStatus !== 'all')
                        ? 'border-primary text-primary'
                        : ''
                    )}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                    {(filterOptions.minPrice !== undefined ||
                      filterOptions.maxPrice !== undefined ||
                      filterOptions.minStock !== undefined ||
                      (filterOptions.stockStatus && filterOptions.stockStatus !== 'all')) && (
                      <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </Button>
                </div>

                {/* Sort */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                  >
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                  <SortMenu
                    isOpen={isSortMenuOpen}
                    onClose={() => setIsSortMenuOpen(false)}
                    currentSort={sortOption}
                    onSort={setSortOption}
                  />
                </div>

                {/* Add Item */}
                <Button
                  size="sm"
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={() => navigate('/products/add')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>

            {/* Filter Modal */}
            <FilterModal
              isOpen={isFilterModalOpen}
              onClose={() => setIsFilterModalOpen(false)}
              currentFilters={filterOptions}
              onApply={setFilterOptions}
            />

            {/* Products Display */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  {selectedSubcategory
                    ? `No products in ${getCategoryName(selectedSubcategory)}`
                    : selectedCategory
                    ? `No products in ${getCategoryName(selectedCategory)}`
                    : 'Try adjusting your filters'}
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="transition-all duration-300">
                {viewMode === 'grid' ? (
                  <ProductGrid products={filteredProducts as Product[]} />
                ) : (
                  <ProductTable products={filteredProducts as Product[]} />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Services Tab Content */}
      {activeTab === 'services' && (
        <>
          <div className="flex gap-6">
            {/* Service Categories Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="space-y-1">
                <button
                  onClick={clearServiceFilters}
                  className={cn(
                    'w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    !selectedServiceCategory && !selectedServiceSubcategory
                      ? 'bg-[#F5E6EC] text-primary border-r-4 border-primary'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  All Services
                </button>

                {serviceCategories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => handleServiceCategoryClick(category.id)}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm font-semibold rounded-md flex items-center justify-between transition-colors',
                        selectedServiceCategory === category.id && !selectedServiceSubcategory
                          ? 'bg-[#F5E6EC] text-primary border-r-4 border-primary'
                          : 'text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      {category.name}
                      {category.subcategories && (
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 transition-transform duration-200',
                            expandedServiceCategory === category.id && 'rotate-180'
                          )}
                        />
                      )}
                    </button>
                    {expandedServiceCategory === category.id && category.subcategories && (
                      <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                        {category.subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => handleServiceSubcategoryClick(sub, category.id)}
                            className={cn(
                              'block w-full text-left px-4 py-2 text-sm rounded-md transition-colors',
                              selectedServiceSubcategory === sub &&
                                selectedServiceCategory === category.id
                                ? 'bg-[#F5E6EC] text-primary font-medium'
                                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                            )}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">Your Appointments</h2>
                  {hasActiveServiceFilters() && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {selectedServiceSubcategory
                          ? `Showing: ${selectedServiceSubcategory}`
                          : selectedServiceCategory
                          ? `Showing: ${serviceCategories.find((c) => c.id === selectedServiceCategory)?.name}`
                          : serviceSearchQuery
                          ? `Search: "${serviceSearchQuery}"`
                          : 'Filtered'}
                      </span>
                      <button
                        onClick={clearServiceFilters}
                        className="text-xs text-primary hover:text-primary/80 underline"
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                  <span className="text-sm text-gray-500">
                    ({filteredAppointments.length}{' '}
                    {filteredAppointments.length === 1 ? 'appointment' : 'appointments'})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search appointments..."
                      value={serviceSearchQuery}
                      onChange={(e) => setServiceSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-56"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                    onClick={() => setIsAddServiceModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add a Service
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setIsCreateOrderModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Order
                  </Button>
                </div>
              </div>

              <Calendar
                appointments={filteredAppointments}
                currentDate={currentCalendarDate}
                onDateChange={setCurrentCalendarDate}
                onAppointmentClick={(appointment) => {
                  setSelectedAppointment(appointment);
                  setIsAppointmentModalOpen(true);
                }}
              />
            </div>
          </div>

          <AppointmentModal
            isOpen={isAppointmentModalOpen}
            onClose={() => setIsAppointmentModalOpen(false)}
            appointment={selectedAppointment}
          />
          <AddServiceModal
            isOpen={isAddServiceModalOpen}
            onClose={() => setIsAddServiceModalOpen(false)}
            onSubmit={handleAddService}
            categories={subcategoryDropdownOptions}
          />
          <CreateOrderModal
            isOpen={isCreateOrderModalOpen}
            onClose={() => setIsCreateOrderModalOpen(false)}
            onSubmit={handleCreateOrder}
            services={serviceDropdownOptions}
            subcategories={subcategoryDropdownOptions}
          />
        </>
      )}
    </div>
  );
}
