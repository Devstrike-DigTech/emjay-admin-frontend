import { useState, useEffect, useMemo } from 'react';
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
import { mockApi, type DashboardStats, type Category } from '@/shared/lib/mock-api';
import { servicesApi, type ServiceStats, type Appointment, type ServiceCategory } from '@/shared/lib/services-mock-api';
import { Product } from '@/features/products/types/product.types';
import { cn } from '@/shared/lib/utils';
import { useNavigate } from 'react-router-dom';

type ViewMode = 'grid' | 'list';
type TabMode = 'products' | 'services';

export default function DashboardHome() {
  const [activeTab, setActiveTab] = useState<TabMode>('products');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('makeup');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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

  useEffect(() => {
    loadDashboardData();
  }, [activeTab]); // Reload when tab changes

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'products') {
        const [statsData, productsData, categoriesData] = await Promise.all([
          mockApi.getDashboardStats(),
          mockApi.getProducts(),
          mockApi.getCategories(),
        ]);
        setStats(statsData);
        setProducts(productsData);
        setCategories(categoriesData);
      } else {
        const [serviceStatsData, appointmentsData, serviceCategoriesData] = await Promise.all([
          servicesApi.getServiceStats(),
          servicesApi.getAppointments(),
          servicesApi.getServiceCategories(),
        ]);
        setServiceStats(serviceStatsData);
        setAppointments(appointmentsData);
        setServiceCategories(serviceCategoriesData);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Comprehensive filtering, searching, and sorting with useMemo for performance
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Category filter
    if (selectedCategory && !selectedSubcategory) {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    // 2. Subcategory filter
    if (selectedSubcategory) {
      result = result.filter(p => 
        p.categoryId === selectedCategory && p.subcategory === selectedSubcategory
      );
    }

    // 3. Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      );
    }

    // 4. Advanced filters
    if (filterOptions.minPrice !== undefined) {
      result = result.filter(p => p.basePrice >= filterOptions.minPrice!);
    }
    if (filterOptions.maxPrice !== undefined) {
      result = result.filter(p => p.basePrice <= filterOptions.maxPrice!);
    }
    if (filterOptions.minStock !== undefined) {
      result = result.filter(p => p.stockQuantity >= filterOptions.minStock!);
    }
    if (filterOptions.stockStatus && filterOptions.stockStatus !== 'all') {
      switch (filterOptions.stockStatus) {
        case 'in-stock':
          result = result.filter(p => p.stockQuantity > 50);
          break;
        case 'low-stock':
          result = result.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 50);
          break;
        case 'out-of-stock':
          result = result.filter(p => p.stockQuantity === 0);
          break;
      }
    }

    // 5. Sort
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
  }, [products, selectedCategory, selectedSubcategory, searchQuery, filterOptions, sortOption]);

  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setExpandedCategory(categoryId); // Auto-expand when selected
  };

  const handleSubcategoryClick = (subcategory: string, categoryId: string) => {
    setSelectedCategory(categoryId); // Make sure category is set
    setSelectedSubcategory(subcategory);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchQuery('');
    setFilterOptions({ stockStatus: 'all' });
    setSortOption('name-asc');
  };

  const hasActiveFilters = () => {
    return selectedCategory || 
           selectedSubcategory || 
           searchQuery.trim() || 
           filterOptions.minPrice !== undefined ||
           filterOptions.maxPrice !== undefined ||
           filterOptions.minStock !== undefined ||
           (filterOptions.stockStatus && filterOptions.stockStatus !== 'all');
  };

  // Filtered appointments for services tab
  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    // Filter by service category
    if (selectedServiceCategory) {
      // Map category ID to service names
      const categoryServiceMap: Record<string, string[]> = {
        'makeup': ['Make Up'],
        'nails': ['Nails'],
        'hair': ['Hair'],
      };
      
      const serviceNames = categoryServiceMap[selectedServiceCategory] || [];
      result = result.filter(apt => serviceNames.includes(apt.service));
    }

    // Filter by subcategory (we'll need to enhance appointment data to support this)
    if (selectedServiceSubcategory) {
      // For now, filter appointments that match the subcategory in some way
      // In a real app, appointments would have subcategory data
      result = result.filter(apt => {
        // This is a placeholder - in production, you'd have apt.subcategory
        return true; // Keep all for now, can be enhanced
      });
    }

    // Search filter
    if (serviceSearchQuery.trim()) {
      const query = serviceSearchQuery.toLowerCase();
      result = result.filter(apt => 
        apt.customerName.toLowerCase().includes(query) ||
        apt.service.toLowerCase().includes(query)
      );
    }

    return result;
  }, [appointments, selectedServiceCategory, selectedServiceSubcategory, serviceSearchQuery]);

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

  const hasActiveServiceFilters = () => {
    return selectedServiceCategory || selectedServiceSubcategory || serviceSearchQuery.trim();
  };

  // Prepare dropdown options for modals
  const serviceDropdownOptions = useMemo(() => {
    return [
      { value: 'makeup', label: 'Make Up' },
      { value: 'nails', label: 'Nails' },
      { value: 'hair', label: 'Hair' },
    ];
  }, []);

  const subcategoryDropdownOptions = useMemo(() => {
    const allSubcategories: { value: string; label: string }[] = [];
    serviceCategories.forEach(cat => {
      cat.subcategories.forEach(sub => {
        allSubcategories.push({
          value: `${cat.id}-${sub.toLowerCase().replace(/\s+/g, '-')}`,
          label: `${cat.name} - ${sub}`,
        });
      });
    });
    return allSubcategories;
  }, [serviceCategories]);

  const handleAddService = (data: ServiceFormData) => {
    console.log('Adding new service:', data);
    // In production, call API to create service
    // await servicesApi.createService(data);
    alert(`Service "${data.name}" created successfully!`);
  };

  const handleCreateOrder = (data: OrderFormData) => {
    console.log('Creating new order:', data);
    // In production, call API to create appointment
    // await servicesApi.createAppointment({...});
    alert(`Order created for ${data.clientName} on ${data.date} at ${data.time}`);
  };

  if (isLoading) {
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
  Hey Emjay 👋 <span className="text-sm font-normal text-gray-600">- here's what's happing on your store today</span>
</h1>
        </div>
        <div className="hidden lg:block">
          {/* Search is in the header */}
        </div>
      </div>

      {/* Stats Cards */}
         
          {activeTab === 'products' ? (
            <>
            {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
            label="Best Selling Product"
            value={stats.bestSellingProduct.name}
            subtitle={`${stats.bestSellingProduct.unitsSold} Units Sold in the last month`}
            change={stats.bestSellingProduct.change}
            dropdown
            navigateTo="/analytics/most-purchased-products"
          />
          <StatCard
            label="Inventory Amount"
            value={stats.inventoryAmount.count}
            subtitle="Items are in the inventory"
            change={stats.inventoryAmount.change}
            dropdown
            navigateTo="/analytics/total-sales"
          />
          <StatCard
            label="Most Purchased day"
            value={stats.mostPurchasedDay.day}
            subtitle={`${stats.mostPurchasedDay.unitsSold} Units Sold on friday`}
            change={stats.mostPurchasedDay.change}
            dropdown
            navigateTo="/analytics/most-purchased-day"
          />
          <StatCard
            label="Products out of Stock"
            value={stats.productsOutOfStock.name}
            subtitle={`${stats.productsOutOfStock.stock} units in the inventory`}
            change={stats.productsOutOfStock.change}
            navigateTo="/analytics/inventory"
          />
          </div>
          )}
          </>
          ):(
            <div>
    {/* Service Stats Cards */}
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
                label="Most booked day"
                value={serviceStats.mostBookedDay.day}
                subtitle={`${serviceStats.mostBookedDay.orders} orders on Friday`}
                change={serviceStats.mostBookedDay.change}
                dropdown
              />
              <StatCard
                label="Service with the lowest orders"
                value={serviceStats.lowestOrders.name}
                subtitle={`${serviceStats.lowestOrders.orders} Orders in the inventory`}
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
          {/* Categories Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-1">
              {/* All Products Option */}
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

              {/* Category List */}
              {categories.map((category) => (
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
                    {category.subcategories && (
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          expandedCategory === category.id && 'rotate-180'
                        )}
                      />
                    )}
                  </button>
                  {expandedCategory === category.id && category.subcategories && (
                    <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {category.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => handleSubcategoryClick(sub, category.id)}
                          className={cn(
                            'block w-full text-left px-4 py-2 text-sm rounded-md transition-colors',
                            selectedSubcategory === sub && selectedCategory === category.id
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

          {/* Products Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                {/* Active Filter Indicator */}
                {hasActiveFilters() && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {selectedSubcategory 
                        ? `Showing: ${selectedSubcategory}` 
                        : selectedCategory 
                        ? `Showing: ${categories.find(c => c.id === selectedCategory)?.name}` 
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
                  ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'})
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
                      hasActiveFilters() && filterOptions.minPrice !== undefined || filterOptions.maxPrice !== undefined || filterOptions.minStock !== undefined || (filterOptions.stockStatus && filterOptions.stockStatus !== 'all')
                        ? 'border-primary text-primary'
                        : ''
                    )}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                    {(filterOptions.minPrice !== undefined || filterOptions.maxPrice !== undefined || filterOptions.minStock !== undefined || (filterOptions.stockStatus && filterOptions.stockStatus !== 'all')) && (
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
                <Button size="sm" className="bg-primary text-white hover:bg-primary/90" onClick={() => navigate('/products/add')}>
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
                    ? `No products in ${selectedSubcategory} category`
                    : selectedCategory
                    ? `No products in ${categories.find(c => c.id === selectedCategory)?.name} category`
                    : 'Try adjusting your filters'}
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="transition-all duration-300">
                {viewMode === 'grid' ? (
                  <ProductGrid products={filteredProducts} />
                ) : (
                  <ProductTable products={filteredProducts} />
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
                {/* All Services Option */}
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

                {/* Service Category List */}
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
                              selectedServiceSubcategory === sub && selectedServiceCategory === category.id
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
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-gray-900">Your Appointments</h2>
                  {/* Active Filter Indicator */}
                  {hasActiveServiceFilters() && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {selectedServiceSubcategory 
                          ? `Showing: ${selectedServiceSubcategory}` 
                          : selectedServiceCategory 
                          ? `Showing: ${serviceCategories.find(c => c.id === selectedServiceCategory)?.name}` 
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
                    ({filteredAppointments.length} {filteredAppointments.length === 1 ? 'appointment' : 'appointments'})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Search */}
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

                  {/* Add Service */}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary/10"
                    onClick={() => setIsAddServiceModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add a Service
                  </Button>

                  {/* Create Order */}
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

              {/* Calendar */}
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

          {/* Appointment Modal */}
          <AppointmentModal
            isOpen={isAppointmentModalOpen}
            onClose={() => setIsAppointmentModalOpen(false)}
            appointment={selectedAppointment}
          />

          {/* Add Service Modal */}
          <AddServiceModal
            isOpen={isAddServiceModalOpen}
            onClose={() => setIsAddServiceModalOpen(false)}
            onSubmit={handleAddService}
            categories={subcategoryDropdownOptions}
          />

          {/* Create Order Modal */}
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