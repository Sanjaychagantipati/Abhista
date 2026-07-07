import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ContractorPageShell } from '../../components/contractor/ContractorPageShell'
import { useContractorDispatch, useContractorSelector } from '../../hooks/contractor/useContractorStore'
import { fetchMyPortfolio, deletePortfolioItem, clearPortfolioMessages } from '../../store/contractor/portfolioSlice'

export function PortfolioListPage() {
	const dispatch = useContractorDispatch()
	const { items, loading, error, successMessage } = useContractorSelector((state) => state.portfolio)

	useEffect(() => {
		void dispatch(fetchMyPortfolio())
	}, [dispatch])

	useEffect(() => {
		if (error || successMessage) {
			const timer = setTimeout(() => {
				dispatch(clearPortfolioMessages())
			}, 5000)
			return () => clearTimeout(timer)
		}
	}, [error, successMessage, dispatch])

	const handleDelete = (id: number, title: string) => {
		if (window.confirm(`Are you sure you want to delete "${title}" from your portfolio?`)) {
			void dispatch(deletePortfolioItem(id))
		}
	}

	return (
		<ContractorPageShell>
			<div className="flex flex-col gap-6">
				{/* Header Actions */}
				<section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-3xl font-bold text-stone-950">Project Portfolio</h1>
						<p className="mt-1 text-sm text-stone-600">
							Showcase your completed projects and craftsmanship to potential clients.
						</p>
					</div>
					<Link
						to="/contractor/portfolio/create"
						className="inline-flex items-center justify-center rounded-md bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 self-start sm:self-auto"
					>
						Add Project
					</Link>
				</section>

				{/* Notifications */}
				{successMessage && (
					<div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
						{successMessage}
					</div>
				)}
				{error && (
					<div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
						{error}
					</div>
				)}

				{/* Loading State */}
				{loading && items.length === 0 && (
					<div className="flex justify-center py-12">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-700 border-t-transparent" />
					</div>
				)}

				{/* Empty State */}
				{!loading && items.length === 0 && (
					<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white px-6 py-16 text-center shadow-sm">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-700">
							<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
						</div>
						<h3 className="mt-4 text-lg font-semibold text-stone-950">No Projects Added Yet</h3>
						<p className="mt-2 max-w-sm text-sm text-stone-600">
							Create an impressive online portfolio by showcasing your best renovation, design, or landscaping work.
						</p>
						<Link
							to="/contractor/portfolio/create"
							className="mt-6 inline-flex items-center justify-center rounded-md bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800 focus:outline-none"
						>
							Add Your First Project
						</Link>
					</div>
				)}

				{/* Portfolio Grid */}
				{items.length > 0 && (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{items.map((item) => (
							<article
								key={item.id}
								className="group flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
							>
								{/* Project Image Header */}
								<div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100">
									{item.imageUrl ? (
										<img
											src={item.imageUrl}
											alt={item.title}
											className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
											onError={(e) => {
												const target = e.target as HTMLImageElement
												target.src = ''
												target.className = 'hidden'
											}}
										/>
									) : null}
									{/* Default Placeholder when no image is supplied or loaded */}
									{!item.imageUrl && (
										<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 text-amber-700">
											<svg className="h-12 w-12 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.5}
													d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
												/>
											</svg>
										</div>
									)}
									{/* Project Type Badge */}
									<span className="absolute left-3 top-3 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-semibold text-amber-50 backdrop-blur-sm">
										{item.projectType}
									</span>
								</div>

								{/* Project Content */}
								<div className="flex flex-1 flex-col p-5">
									<h3 className="text-xl font-bold text-stone-950 line-clamp-1">{item.title}</h3>
									<p className="mt-2 flex-1 text-sm text-stone-600 line-clamp-3 leading-relaxed">
										{item.description}
									</p>
									
									{/* Action Buttons */}
									<div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
										<span className="text-xs text-stone-500">
											Added {new Date(item.createdAt).toLocaleDateString()}
										</span>
										<button
											onClick={() => handleDelete(item.id, item.title)}
											className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 transition hover:text-red-800 focus:outline-none"
										>
											<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
											Delete
										</button>
									</div>
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</ContractorPageShell>
	)
}
