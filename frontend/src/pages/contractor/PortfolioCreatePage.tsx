import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ContractorPageShell } from '../../components/contractor/ContractorPageShell'
import { useContractorDispatch, useContractorSelector } from '../../hooks/contractor/useContractorStore'
import { createPortfolio, clearPortfolioMessages } from '../../store/contractor/portfolioSlice'

const PROJECT_TYPES = [
	'Home Renovation',
	'Residential Construction',
	'Commercial Building',
	'Interior Design',
	'Landscaping',
	'Electrical & Plumbing',
	'Painting & Decoration',
	'Other'
]

export function PortfolioCreatePage() {
	const dispatch = useContractorDispatch()
	const navigate = useNavigate()
	const { saving, error } = useContractorSelector((state) => state.portfolio)

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		projectType: PROJECT_TYPES[0],
		imageUrl: ''
	})

	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

	useEffect(() => {
		dispatch(clearPortfolioMessages())
		return () => {
			dispatch(clearPortfolioMessages())
		}
	}, [dispatch])

	const validate = () => {
		const errors: Record<string, string> = {}
		if (!formData.title.trim()) {
			errors.title = 'Project title is required'
		} else if (formData.title.length > 150) {
			errors.title = 'Title must not exceed 150 characters'
		}

		if (!formData.description.trim()) {
			errors.description = 'Project description is required'
		} else if (formData.description.length > 1000) {
			errors.description = 'Description must not exceed 1000 characters'
		}

		if (!formData.projectType) {
			errors.projectType = 'Project type is required'
		}

		if (formData.imageUrl.trim()) {
			try {
				new URL(formData.imageUrl)
			} catch {
				errors.imageUrl = 'Image URL must be a valid absolute URL'
			}
		}

		setFieldErrors(errors)
		return Object.keys(errors).length === 0
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
		if (fieldErrors[name]) {
			setFieldErrors((prev) => ({ ...prev, [name]: '' }))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validate()) {
			return
		}

		const payload = {
			title: formData.title.trim(),
			description: formData.description.trim(),
			projectType: formData.projectType,
			imageUrl: formData.imageUrl.trim() || undefined
		}

		try {
			await dispatch(createPortfolio(payload)).unwrap()
			navigate('/contractor/portfolio')
		} catch {
			// Error is set in the Redux store error state
		}
	}

	return (
		<ContractorPageShell>
			<div className="mx-auto max-w-2xl">
				{/* Top navigation back link */}
				<Link
					to="/contractor/portfolio"
					className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 transition hover:text-stone-950"
				>
					<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					Back to Portfolio
				</Link>

				<div className="mt-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
					<h1 className="text-2xl font-bold text-stone-950">Add Portfolio Project</h1>
					<p className="mt-1 text-sm text-stone-600">
						Provide details of your completed project to showcase in your portfolio.
					</p>

					{/* Global submission error */}
					{error && (
						<div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
						{/* Title */}
						<div className="flex flex-col gap-1.5">
							<label htmlFor="title" className="text-sm font-semibold text-stone-700">
								Project Title <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								disabled={saving}
								className={`rounded-md border px-3 py-2 text-sm text-stone-950 transition focus:outline-none focus:ring-2 focus:ring-amber-500 ${
									fieldErrors.title ? 'border-red-400 focus:ring-red-400' : 'border-stone-300'
								}`}
								placeholder="e.g. Modern Kitchen Renovation"
							/>
							{fieldErrors.title && <p className="text-xs text-red-600">{fieldErrors.title}</p>}
						</div>

						{/* Project Type */}
						<div className="flex flex-col gap-1.5">
							<label htmlFor="projectType" className="text-sm font-semibold text-stone-700">
								Project Type <span className="text-red-500">*</span>
							</label>
							<select
								id="projectType"
								name="projectType"
								value={formData.projectType}
								onChange={handleChange}
								disabled={saving}
								className="rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-950 transition focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
							>
								{PROJECT_TYPES.map((type) => (
									<option key={type} value={type}>
										{type}
									</option>
								))}
							</select>
							{fieldErrors.projectType && <p className="text-xs text-red-600">{fieldErrors.projectType}</p>}
						</div>

						{/* Description */}
						<div className="flex flex-col gap-1.5">
							<label htmlFor="description" className="text-sm font-semibold text-stone-700">
								Description <span className="text-red-500">*</span>
							</label>
							<textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleChange}
								disabled={saving}
								rows={5}
								className={`rounded-md border px-3 py-2 text-sm text-stone-950 transition focus:outline-none focus:ring-2 focus:ring-amber-500 ${
									fieldErrors.description ? 'border-red-400 focus:ring-red-400' : 'border-stone-300'
								}`}
								placeholder="Describe the scope of work, materials used, challenges solved, and specific details..."
							/>
							<div className="flex justify-between text-xs text-stone-500">
								<span>{formData.description.length} / 1000 characters</span>
								{fieldErrors.description && <span className="text-red-600">{fieldErrors.description}</span>}
							</div>
						</div>

						{/* Image URL */}
						<div className="flex flex-col gap-1.5">
							<label htmlFor="imageUrl" className="text-sm font-semibold text-stone-700">
								Image URL <span className="text-xs font-normal text-stone-500">(Optional)</span>
							</label>
							<input
								type="text"
								id="imageUrl"
								name="imageUrl"
								value={formData.imageUrl}
								onChange={handleChange}
								disabled={saving}
								className={`rounded-md border px-3 py-2 text-sm text-stone-950 transition focus:outline-none focus:ring-2 focus:ring-amber-500 ${
									fieldErrors.imageUrl ? 'border-red-400 focus:ring-red-400' : 'border-stone-300'
								}`}
								placeholder="e.g. https://images.unsplash.com/photo-..."
							/>
							{fieldErrors.imageUrl ? (
								<p className="text-xs text-red-600">{fieldErrors.imageUrl}</p>
							) : (
								<p className="text-xs text-stone-500">
									Provide a direct link to an image of the finished project (Unsplash, Imgur, etc.).
								</p>
							)}
						</div>

						{/* Action Buttons */}
						<div className="mt-4 flex items-center justify-end gap-3 border-t border-stone-100 pt-5">
							<Link
								to="/contractor/portfolio"
								className="rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
							>
								Cancel
							</Link>
							<button
								type="submit"
								disabled={saving}
								className="inline-flex items-center justify-center rounded-md bg-amber-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-800 focus:outline-none disabled:opacity-50"
							>
								{saving ? (
									<>
										<svg className="mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
										</svg>
										Saving Project...
									</>
								) : (
									'Save Project'
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</ContractorPageShell>
	)
}
