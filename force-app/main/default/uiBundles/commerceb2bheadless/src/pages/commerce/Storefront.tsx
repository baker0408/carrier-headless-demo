import { useState } from "react";
import { Link } from "react-router";
import { Menu, Tag, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import CategorySidebar from "@/components/catalog/CategorySidebar";
import ProductGrid from "@/components/catalog/ProductGrid";
import { useCategories } from "@/hooks/useCategories";
import { useProductSearch } from "@/hooks/useProductSearch";
import carrierHero from "@assets/carrier-hero.png";

// Storefront landing:
//   - Left sidebar with nested categories (always visible on desktop; drawer on mobile)
//   - Hero promo banner ("Sale on everything")
//   - Featured products driven off the first real category returned by the API
export default function Storefront() {
	const { data: catData, loading: catLoading, error: catError } = useCategories();
	const [drawerOpen, setDrawerOpen] = useState(false);

	const topCategories = catData ?? [];
	// Pick the first top-level category id for featured products. No hardcoded
	// ids — we bind to whatever the store catalogue surfaces.
	const featuredCategoryId = topCategories.find((c) => c.id)?.id;

	const { data: searchData, loading: searchLoading, error: searchError } = useProductSearch({
		categoryId: featuredCategoryId,
		pageSize: 12,
	});
	const products = searchData?.productsPage?.products ?? [];

	return (
		<div className="w-full">
			{/* Hamburger (mobile) reveals the category drawer. Positioned below the
			    global navbar so both can be used together. */}
			<div className="lg:hidden px-4 py-2 border-b flex items-center gap-2">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setDrawerOpen(true)}
					aria-label="Open categories"
				>
					<Menu className="w-4 h-4 mr-2" /> Categories
				</Button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 px-4 sm:px-6 lg:px-8 py-6">
				<aside className="hidden lg:block sticky top-20 self-start">
					<h2 className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
						Browse
					</h2>
					<CategorySidebar items={topCategories} loading={catLoading} />
				</aside>

				<div className="space-y-10 min-w-0">
					{/* Carrier hero */}
					<section className="relative overflow-hidden rounded-xl border">
						<img
							src={carrierHero}
							alt="Carrier 48FE WeatherMaker rooftop units"
							className="absolute inset-0 h-full w-full object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-sidebar-primary/90 via-primary/75 to-primary/25" />
						<div className="relative p-8 sm:p-12 lg:p-16 max-w-2xl space-y-3 text-white">
							<div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/15 text-white text-xs font-semibold">
								<Tag className="w-3 h-3" /> Comfort360 Dealer Parts
							</div>
							<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
								48FE WeatherMaker Parts
							</h1>
							<p className="text-white/90 max-w-lg">
								Genuine Carrier replacement parts for the 48FE WeatherMaker rooftop
								unit — ordered fast through Comfort360.
							</p>
							<Button size="lg" variant="secondary" asChild>
								<Link to="#featured">Shop parts</Link>
							</Button>
						</div>
					</section>

					{catError && (
						<Alert variant="destructive">
							<AlertTitle>Could not load categories</AlertTitle>
							<AlertDescription>{catError}</AlertDescription>
						</Alert>
					)}

					<section id="featured" className="space-y-4">
						<div className="flex items-baseline justify-between">
							<h2 className="text-lg font-semibold">Featured products</h2>
						</div>
						{searchError && featuredCategoryId && (
							<Alert variant="destructive">
								<AlertTitle>Could not load featured products</AlertTitle>
								<AlertDescription>{searchError}</AlertDescription>
							</Alert>
						)}
						<ProductGrid
							products={products}
							currency={searchData?.productsPage?.currencyIsoCode}
							loading={catLoading || (!!featuredCategoryId && searchLoading)}
							emptyMessage={
								featuredCategoryId
									? "No products to show yet."
									: "Add a product category to your store to see featured items here."
							}
						/>
					</section>
				</div>
			</div>

			{/* Mobile drawer */}
			{drawerOpen && (
				<div
					className="fixed inset-0 z-50 bg-black/40 lg:hidden"
					onClick={() => setDrawerOpen(false)}
					role="presentation"
				>
					<div
						className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-sm font-semibold">Categories</h2>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setDrawerOpen(false)}
								aria-label="Close categories"
							>
								<X className="w-4 h-4" />
							</Button>
						</div>
						<CategorySidebar
							items={topCategories}
							loading={catLoading}
							onNavigate={() => setDrawerOpen(false)}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
