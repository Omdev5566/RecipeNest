import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { getAllRecipesForAnalytics, getChefRecipeById, updateChefRecipe } from '../../services/chefServices';
import { useAuth } from '../../context/AuthContext';

export default function EditRecipe() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { user } = useAuth();

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [categories, setCategories] = useState<string[]>([]);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [difficulty, setDifficulty] = useState('');
	const [cookTime, setCookTime] = useState('');
	const [servings, setServings] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [ingredients, setIngredients] = useState<string[]>(['']);
	const [instructions, setInstructions] = useState<string[]>(['']);

	useEffect(() => {
		const loadData = async () => {
			if (!id) {
				toast.error('Invalid recipe id');
				navigate('/manage-recipes');
				return;
			}

			try {
				setLoading(true);

				const [recipe, allRecipes] = await Promise.all([
					getChefRecipeById(id),
					getAllRecipesForAnalytics(),
				]);

				if (user?.id && Number(recipe?.chef_id) !== Number(user.id)) {
					toast.error('You can only edit your own recipes');
					navigate('/manage-recipes');
					return;
				}

				setTitle(recipe?.title || '');
				setDescription(recipe?.description || '');
				setCategory(recipe?.category || '');
				setDifficulty(recipe?.difficulty || '');
				setCookTime(String(recipe?.cook_time || ''));
				setServings(String(recipe?.servings || ''));
				setImageUrl(recipe?.image_url || recipe?.image || '');

				const existingIngredients = Array.isArray(recipe?.ingredients)
					? recipe.ingredients.map((item: any) => String(item).trim()).filter(Boolean)
					: [];
				setIngredients(existingIngredients.length ? existingIngredients : ['']);

				const existingInstructions = Array.isArray(recipe?.instructions)
					? recipe.instructions
							.map((step: any) => (typeof step === 'string' ? step : step?.instruction))
							.map((item: any) => String(item || '').trim())
							.filter(Boolean)
					: [];
				setInstructions(existingInstructions.length ? existingInstructions : ['']);

				const uniqueCategories = Array.from(
					new Set(allRecipes.map((recipeItem: any) => recipeItem.category).filter(Boolean)),
				);

				if (recipe?.category && !uniqueCategories.includes(recipe.category)) {
					uniqueCategories.push(recipe.category);
				}

				setCategories(uniqueCategories);
			} catch (error: any) {
				toast.error(error?.response?.data?.error || 'Failed to load recipe');
				navigate('/manage-recipes');
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [id, navigate, user?.id]);

	const validIngredients = useMemo(
		() => ingredients.map((item) => item.trim()).filter(Boolean),
		[ingredients],
	);

	const validInstructions = useMemo(
		() => instructions.map((item) => item.trim()).filter(Boolean),
		[instructions],
	);

	const handleAddIngredient = () => {
		setIngredients([...ingredients, '']);
	};

	const handleRemoveIngredient = (index: number) => {
		setIngredients(ingredients.filter((_, i) => i !== index));
	};

	const handleIngredientChange = (index: number, value: string) => {
		const next = [...ingredients];
		next[index] = value;
		setIngredients(next);
	};

	const handleAddInstruction = () => {
		setInstructions([...instructions, '']);
	};

	const handleRemoveInstruction = (index: number) => {
		setInstructions(instructions.filter((_, i) => i !== index));
	};

	const handleInstructionChange = (index: number, value: string) => {
		const next = [...instructions];
		next[index] = value;
		setInstructions(next);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!id) return;

		if (!category || !difficulty) {
			toast.error('Please select category and difficulty');
			return;
		}

		if (validIngredients.length === 0 || validInstructions.length === 0) {
			toast.error('Please add at least one ingredient and one instruction');
			return;
		}

		try {
			setSaving(true);
			await updateChefRecipe(id, {
				title,
				description,
				image_url: imageUrl,
				category,
				difficulty,
				cook_time: Number(cookTime),
				servings: Number(servings),
				ingredients: validIngredients,
				instructions: validInstructions,
			});

			toast.success('Recipe updated successfully!');
			navigate('/manage-recipes');
		} catch (error: any) {
			toast.error(error?.response?.data?.error || 'Failed to update recipe');
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<div className="p-8 min-h-screen flex items-center justify-center">
				<div className="flex items-center gap-3 text-muted-foreground">
					<Loader2 className="h-5 w-5 animate-spin" />
					Loading recipe...
				</div>
			</div>
		);
	}

	return (
		<div className="p-8">
			<Button variant="ghost" onClick={() => navigate('/manage-recipes')} className="mb-6">
				<ArrowLeft className="h-4 w-4 mr-2" />
				Back to Recipes
			</Button>

			<h1 className="text-4xl mb-8">Edit Recipe</h1>

			<form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="title">Recipe Title</Label>
							<Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter recipe title" required />
						</div>

						<div>
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Brief description of the recipe"
								rows={3}
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="category">Category</Label>
								<Select value={category} onValueChange={setCategory} required>
									<SelectTrigger id="category">
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((cat) => (
											<SelectItem key={cat} value={cat}>
												{cat}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="difficulty">Difficulty</Label>
								<Select value={difficulty} onValueChange={setDifficulty} required>
									<SelectTrigger id="difficulty">
										<SelectValue placeholder="Select difficulty" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Easy">Easy</SelectItem>
										<SelectItem value="Medium">Medium</SelectItem>
										<SelectItem value="Hard">Hard</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="cookTime">Cook Time (min)</Label>
								<Input
									id="cookTime"
									type="number"
									value={cookTime}
									onChange={(e) => setCookTime(e.target.value)}
									placeholder="30"
									min={1}
									required
								/>
							</div>

							<div>
								<Label htmlFor="servings">Servings</Label>
								<Input
									id="servings"
									type="number"
									value={servings}
									onChange={(e) => setServings(e.target.value)}
									placeholder="4"
									min={1}
									required
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="image">Image URL</Label>
							<Input
								id="image"
								type="url"
								value={imageUrl}
								onChange={(e) => setImageUrl(e.target.value)}
								placeholder="https://..."
								required
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Ingredients</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{ingredients.map((ingredient, index) => (
							<div key={index} className="flex gap-2">
								<Input
									value={ingredient}
									onChange={(e) => handleIngredientChange(index, e.target.value)}
									placeholder={`Ingredient ${index + 1}`}
									required
								/>
								{ingredients.length > 1 && (
									<Button
										type="button"
										variant="outline"
										size="icon"
										onClick={() => handleRemoveIngredient(index)}
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
						))}
						<Button type="button" variant="outline" onClick={handleAddIngredient} className="w-full">
							<Plus className="h-4 w-4 mr-2" />
							Add Ingredient
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Instructions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{instructions.map((instruction, index) => (
							<div key={index} className="flex gap-2">
								<div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium mt-2">
									{index + 1}
								</div>
								<Textarea
									value={instruction}
									onChange={(e) => handleInstructionChange(index, e.target.value)}
									placeholder={`Step ${index + 1}`}
									rows={2}
									required
								/>
								{instructions.length > 1 && (
									<Button
										type="button"
										variant="outline"
										size="icon"
										onClick={() => handleRemoveInstruction(index)}
										className="mt-2"
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
						))}
						<Button type="button" variant="outline" onClick={handleAddInstruction} className="w-full">
							<Plus className="h-4 w-4 mr-2" />
							Add Instruction
						</Button>
					</CardContent>
				</Card>

				<div className="flex gap-4">
					<Button type="submit" size="lg" disabled={saving}>
						{saving ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Saving...
							</>
						) : (
							'Save Changes'
						)}
					</Button>
					<Button type="button" variant="outline" size="lg" onClick={() => navigate('/manage-recipes')}>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
}
