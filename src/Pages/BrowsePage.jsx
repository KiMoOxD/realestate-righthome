"use client"

import { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { getCollectionData, regionOptionsEn, regionOptionsAr } from "../utils/data"
import Select from "react-select"
import { useAllContext } from "../context/AllContext"
import PropertyCard from "../components/PropertyCard.jsx"
import SkeletonCard from "../components/SkeletonCard"

// Icons
import { IoIosBed } from "react-icons/io"
import { BiPlus, BiMinus } from "react-icons/bi"
import { PiBathtubLight } from "react-icons/pi"
import { VscSettings } from "react-icons/vsc"
import { FiX, FiRefreshCw, FiHome, FiChevronRight, FiChevronDown } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"

const LocationOptions = regionOptionsEn
const ArLocationOptions = regionOptionsAr

const propertyTypes = [
  { label: "Apartment", value: "apartment", ar: "شقة" },
  { label: "Villa", value: "villa", ar: "فيلا" },
  { label: "House", value: "house", ar: "منزل" },
  { label: "Retail", value: "retail", ar: "تجاري" },
]

const sortOptions = [
  { value: "price-asc", label: "Price: Low to High", ar: "السعر: من الأقل للأعلى" },
  { value: "price-desc", label: "Price: High to Low", ar: "السعر: من الأعلى للأقل" },
  { value: "area-desc", label: "Area: Largest First", ar: "المساحة: الأكبر أولاً" },
]

// Helper to manage search params
const updateSearchParams = (searchParams, newParams) => {
  const updated = new URLSearchParams(searchParams.toString())
  for (const [key, value] of Object.entries(newParams)) {
    updated.delete(key)
    if (Array.isArray(value)) {
      value.forEach((v) => updated.append(key, v))
    } else if (value) {
      updated.set(key, value)
    }
  }
  return updated
}

// Custom Select Styles with proper z-index
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.1)" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
    minHeight: "40px",
    backgroundColor: "white",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#eff6ff" : "white",
    color: state.isSelected ? "white" : "#374151",
    padding: "8px 12px",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#dbeafe",
    borderRadius: "4px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#1e40af",
    fontSize: "12px",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#1e40af",
    "&:hover": {
      backgroundColor: "#3b82f6",
      color: "white",
    },
  }),
}

export default function BrowsePage() {
  const { lang } = useAllContext()
  const [searchParams, setSearchParams] = useSearchParams()

  const [masterProperties, setMasterProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isFilterSectionExpanded, setIsFilterSectionExpanded] = useState(true)

  // State for the filter drawer to avoid applying filters until user confirms
  const [drawerState, setDrawerState] = useState({})

  useEffect(() => {
    async function getData() {
      setIsLoading(true)
      const collections = ["villas", "apartments", "retails", "houses"]
      const promises = collections.map(getCollectionData)
      const results = await Promise.all(promises)
      const allProperties = results.flat()

      setMasterProperties(allProperties)
      setIsLoading(false)

      // Set default status if none exists
      if (!searchParams.has("status")) {
        setSearchParams(updateSearchParams(searchParams, { status: "sale" }), { replace: true })
      }
    }
    getData() // eslint-disable-next-line
  }, [])

  const displayedProperties = useMemo(() => {
    const statuses = searchParams.getAll("status")
    const types = searchParams.getAll("type")
    const regions = searchParams.getAll("region")
    const beds = searchParams.get("beds") || 0
    const baths = searchParams.get("baths") || 0
    const minPrice = searchParams.get("minPrice") || 0
    const maxPrice = searchParams.get("maxPrice") || Number.POSITIVE_INFINITY
    const sortBy = searchParams.get("sortBy") || "price-desc"

    if (isLoading) return []

    const filtered = masterProperties.filter((p) => {
      const statusMatch = statuses.length ? statuses.includes(p.status) : true
      const typeMatch = types.length ? types.includes(p.category) : true
      const regionMatch = regions.length ? p.region && regions.includes(p.region.en) : true
      const bedsMatch = beds > 0 ? +p.beds === +beds : true
      const bathsMatch = baths > 0 ? +p.baths === +baths : true
      const priceMatch = +p.price >= minPrice && +p.price <= maxPrice

      return statusMatch && typeMatch && regionMatch && bedsMatch && bathsMatch && priceMatch
    })

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "area-desc":
          return b.area - a.area
        default:
          return 0
      }
    })
  }, [searchParams, masterProperties, isLoading])

  const handleStatusToggle = (status) => {
    const currentStatuses = searchParams.getAll("status")
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status]
    setSearchParams(updateSearchParams(searchParams, { status: newStatuses }))
  }

  const handleRegionChange = (selectedOptions) => {
    const regions = selectedOptions ? selectedOptions.map((o) => o.value.en) : []
    setSearchParams(updateSearchParams(searchParams, { region: regions }))
  }

  const handleSortChange = (selectedOption) => {
    setSearchParams(updateSearchParams(searchParams, { sortBy: selectedOption.value }))
  }

  const openFilterDrawer = () => {
    setDrawerState({
      types: searchParams.getAll("type"),
      beds: searchParams.get("beds") || 0,
      baths: searchParams.get("baths") || 0,
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
    })
    setIsFilterOpen(true)
  }

  const applyDrawerFilters = () => {
    setSearchParams(
      updateSearchParams(searchParams, {
        type: drawerState.types,
        beds: drawerState.beds > 0 ? drawerState.beds : null,
        baths: drawerState.baths > 0 ? drawerState.baths : null,
        minPrice: drawerState.minPrice || null,
        maxPrice: drawerState.maxPrice || null,
      }),
    )
    setIsFilterOpen(false)
  }

  const resetFilters = () => {
    setSearchParams({ status: "sale" })
  }

  const selectedStatuses = searchParams.getAll("status")
  const selectedRegions = LocationOptions.filter((o) => searchParams.getAll("region").includes(o.value.en))
  const selectedSort = sortOptions.find((o) => o.value === searchParams.get("sortBy")) || sortOptions[1]
  const isAnyFilterActive =
    searchParams.toString() !== "status=sale" &&
    searchParams.toString() !== "status=rent" &&
    searchParams.toString() !== ""

  // Generate breadcrumb items based on current filters
  const getBreadcrumbItems = () => {
    const items = [{ label: lang === "en" ? "Home" : "الرئيسية", href: "/", icon: FiHome }]

    const statuses = searchParams.getAll("status")
    const regions = searchParams.getAll("region")
    const types = searchParams.getAll("type")

    if (statuses.length > 0) {
      const statusLabel =
        statuses.includes("sale") && statuses.includes("rent")
          ? lang === "en"
            ? "Properties"
            : "العقارات"
          : statuses.includes("sale")
            ? lang === "en"
              ? "For Sale"
              : "للبيع"
            : lang === "en"
              ? "For Rent"
              : "للإيجار"
      items.push({ label: statusLabel })
    }

    if (regions.length === 1) {
      const region = LocationOptions.find((r) => r.value.en === regions[0])
      if (region) {
        items.push({ label: lang === "en" ? region.label : region.value.ar })
      }
    } else if (regions.length > 1) {
      items.push({ label: lang === "en" ? `${regions.length} Regions` : `${regions.length} مناطق` })
    }

    if (types.length === 1) {
      const type = propertyTypes.find((t) => t.value === types[0])
      if (type) {
        items.push({ label: lang === "en" ? type.label : type.ar })
      }
    } else if (types.length > 1) {
      items.push({ label: lang === "en" ? `${types.length} Types` : `${types.length} أنواع` })
    }

    return items
  }

  const breadcrumbItems = getBreadcrumbItems()

  const Counter = ({ count, onChange, label, icon, arLabel }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{lang === "en" ? label : arLabel}</label>
      <div className="flex items-center rounded-lg overflow-hidden border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, count - 1))}
          className="p-2 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600"
        >
          <BiMinus className="w-4 h-4" />
        </button>
        <div className="flex-grow flex items-center justify-center gap-2 px-4 h-10 bg-white">
          <div className="text-slate-400">{icon}</div>
          <span className="font-semibold text-slate-800">{count}</span>
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(10, count + 1))}
          className="p-2 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-600"
        >
          <BiPlus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-screen-2xl mx-auto px-4 py-2">
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbItems.map((item, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <FiChevronRight className="w-3 h-3 text-slate-400 mx-1" />}
                {item.href ? (
                  <a
                    href={item.href}
                    className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {item.icon && <item.icon className="w-3 h-3" />}
                    {item.label}
                  </a>
                ) : (
                  <span className="text-slate-800 font-medium">{item.label}</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Compact Filter Section */}
      <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-slate-200">
        <div className="max-w-screen-2xl mx-auto">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-800">{lang === "en" ? "Properties" : "العقارات"}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-600">
                  <span>
                    {isLoading
                      ? lang === "en"
                        ? "Loading..."
                        : "جاري التحميل..."
                      : `${displayedProperties.length.toLocaleString()} ${lang === "en" ? "found" : "عقار"}`}
                  </span>
                  {isAnyFilterActive && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {lang === "en" ? "Filtered" : "مفلتر"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Advanced Filters Button */}
                <button
                  onClick={openFilterDrawer}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <VscSettings className="w-4 h-4" />
                  <span className="hidden sm:inline">{lang === "en" ? "Filters" : "فلاتر"}</span>
                </button>

                {/* Reset Button */}
                {isAnyFilterActive && (
                  <button
                    onClick={resetFilters}
                    title={lang === "en" ? "Reset Filters" : "إعادة تعيين"}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                  </button>
                )}

                {/* Toggle Button */}
                <button
                  onClick={() => setIsFilterSectionExpanded(!isFilterSectionExpanded)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform ${isFilterSectionExpanded ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Filter Section */}
          <AnimatePresence>
            {isFilterSectionExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex flex-col lg:flex-row items-center gap-3">
                    {/* Status Toggle */}
                    <div className="bg-slate-100 p-1 rounded-lg flex-shrink-0">
                      <button
                        onClick={() => handleStatusToggle("sale")}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          selectedStatuses.includes("sale")
                            ? "bg-blue-600 text-white"
                            : "text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {lang === "en" ? "Sale" : "بيع"}
                      </button>
                      <button
                        onClick={() => handleStatusToggle("rent")}
                        className={`px-4 py-2 rounded text-sm font-medium transition ${
                          selectedStatuses.includes("rent")
                            ? "bg-blue-600 text-white"
                            : "text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {lang === "en" ? "Rent" : "إيجار"}
                      </button>
                    </div>

                    {/* Region Select */}
                    <div className="flex-grow w-full">
                      <Select
                        isMulti
                        isClearable
                        options={lang === "en" ? LocationOptions : ArLocationOptions}
                        value={selectedRegions}
                        onChange={handleRegionChange}
                        placeholder={lang === "en" ? "Select regions..." : "اختر المناطق..."}
                        styles={customSelectStyles}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        className="text-left"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimized Summary */}
          {!isFilterSectionExpanded && (
            <div className="px-4 py-2 bg-slate-50 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Status */}
                  <div className="flex gap-1">
                    {selectedStatuses.map((status) => (
                      <span key={status} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {status === "sale" ? (lang === "en" ? "Sale" : "بيع") : lang === "en" ? "Rent" : "إيجار"}
                      </span>
                    ))}
                  </div>

                  {/* Regions */}
                  {selectedRegions.length > 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      {selectedRegions.length === 1
                        ? lang === "en"
                          ? selectedRegions[0].label
                          : selectedRegions[0].value.ar
                        : `${selectedRegions.length} ${lang === "en" ? "regions" : "مناطق"}`}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setIsFilterSectionExpanded(true)}
                  className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                >
                  {lang === "en" ? "Expand" : "توسيع"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsFilterOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">{lang === "en" ? "Filters" : "فلاتر"}</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-1 hover:bg-slate-100 rounded">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                {/* Property Types */}
                <div>
                  <h3 className="font-medium mb-3">{lang === "en" ? "Property Type" : "نوع العقار"}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {propertyTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() =>
                          setDrawerState((s) => ({
                            ...s,
                            types: s.types?.includes(type.value)
                              ? s.types.filter((t) => t !== type.value)
                              : [...(s.types || []), type.value],
                          }))
                        }
                        className={`px-3 py-2 text-sm rounded border transition ${
                          drawerState.types?.includes(type.value)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white hover:bg-slate-50 border-slate-200"
                        }`}
                      >
                        {lang === "en" ? type.label : type.ar}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Counters */}
                <div className="space-y-4">
                  <Counter
                    count={drawerState.beds || 0}
                    onChange={(c) => setDrawerState((s) => ({ ...s, beds: c }))}
                    label="Bedrooms"
                    arLabel="غرف النوم"
                    icon={<IoIosBed className="w-4 h-4" />}
                  />
                  <Counter
                    count={drawerState.baths || 0}
                    onChange={(c) => setDrawerState((s) => ({ ...s, baths: c }))}
                    label="Bathrooms"
                    arLabel="الحمامات"
                    icon={<PiBathtubLight className="w-4 h-4" />}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">{lang === "en" ? "Price Range" : "نطاق السعر"}</h3>
                  <div className="space-y-3">
                    <input
                      value={drawerState.minPrice || ""}
                      onChange={(e) => setDrawerState((s) => ({ ...s, minPrice: e.target.value }))}
                      type="number"
                      placeholder={lang === "en" ? "Min Price" : "أقل سعر"}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <input
                      value={drawerState.maxPrice || ""}
                      onChange={(e) => setDrawerState((s) => ({ ...s, maxPrice: e.target.value }))}
                      type="number"
                      placeholder={lang === "en" ? "Max Price" : "أعلى سعر"}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t flex gap-3">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition"
                >
                  {lang === "en" ? "Cancel" : "إلغاء"}
                </button>
                <button
                  onClick={applyDrawerFilters}
                  className="flex-1 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
                >
                  {lang === "en" ? "Apply" : "تطبيق"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-screen-2xl mx-auto p-4">
        {/* Results Header with Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="mb-3 sm:mb-0">
            <h2 className="font-semibold text-slate-800">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  {lang === "en" ? "Loading..." : "جاري التحميل..."}
                </span>
              ) : (
                `${displayedProperties.length.toLocaleString()} ${lang === "en" ? "Properties" : "عقار"}`
              )}
            </h2>
          </div>
          <div className="w-full sm:w-64">
            <Select
              options={sortOptions}
              value={selectedSort}
              onChange={handleSortChange}
              getOptionLabel={(option) => (lang === "en" ? option.label : option.ar)}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              placeholder={lang === "en" ? "Sort by..." : "ترتيب حسب..."}
            />
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : displayedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <FiHome className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {lang === "en" ? "No Properties Found" : "لم يتم العثور على عقارات"}
            </h3>
            <p className="text-slate-600 mb-6">{lang === "en" ? "Try adjusting your filters" : "حاول تعديل الفلاتر"}</p>
            <button
              onClick={resetFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {lang === "en" ? "Reset Filters" : "إعادة تعيين"}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}