"use client";

import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  generatePlayerObjectives,
  generateSpookyEnvironment,
  type GeneratePlayerObjectivesOutput,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Backpack,
  Ghost,
  Loader2,
  Map,
  Sparkles,
  Skull,
  Swords,
  BookOpen,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PentagramIcon } from "./icons/pentagram-icon";

const environmentSchema = z.object({
  prompt: z
    .string()
    .min(15, "The description of your nightmare is too short.")
    .max(300, "The nightmare is becoming too elaborate."),
});

const objectiveSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "You must choose your fate.",
  }),
});

type LoadingState = "idle" | "environment" | "objective";

export function GameUI() {
  const [environment, setEnvironment] = useState<string>("");
  const [objective, setObjective] =
    useState<GeneratePlayerObjectivesOutput | null>(null);
  const [inventory, setInventory] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");

  const { toast } = useToast();

  const environmentForm = useForm<z.infer<typeof environmentSchema>>({
    resolver: zodResolver(environmentSchema),
    defaultValues: { prompt: "" },
  });

  const objectiveForm = useForm<z.infer<typeof objectiveSchema>>({
    resolver: zodResolver(objectiveSchema),
  });

  async function onEnvironmentSubmit(values: z.infer<typeof environmentSchema>) {
    setLoadingState("environment");
    setEnvironment("");
    setObjective(null);
    try {
      const result = await generateSpookyEnvironment(values);
      setEnvironment(result.description);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Creating Nightmare",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setLoadingState("idle");
    }
  }

  async function onObjectiveSubmit(values: z.infer<typeof objectiveSchema>) {
    setLoadingState("objective");
    setObjective(null);
    try {
      const result = await generatePlayerObjectives({
        environmentDescription: environment,
        difficulty: values.difficulty,
      });
      setObjective(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Devising Fate",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setLoadingState("idle");
    }
  }

  function handleCompleteObjective() {
    if (!objective) return;
    setScore((prev) => prev + 100);
    setInventory((prev) => [...prev, objective.reward]);
    setObjective(null);
    toast({
      title: "Objective Complete!",
      description: `You've been rewarded with: ${objective.reward}`,
    });
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-8 md:mb-12">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter animate-flicker flex items-center justify-center gap-4">
          <PentagramIcon className="w-12 h-12 md:w-16 md:h-16 text-primary" />
          October Nightmares
          <PentagramIcon className="w-12 h-12 md:w-16 md:h-16 text-primary" />
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A generative horror experience
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <aside className="md:col-span-2 flex flex-col gap-8">
          <GeneratorCard
            title="Summon the Nightmare"
            description="Describe the scene of your horror."
            icon={<Map />}
          >
            <HookForm form={environmentForm} onSubmit={onEnvironmentSubmit}>
              <FormField
                control={environmentForm.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Nightmare Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., an abandoned hospital where the clocks are stuck at midnight..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loadingState !== "idle"}
              >
                {loadingState === "environment" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Generate Environment"
                )}
              </Button>
            </HookForm>
          </GeneratorCard>

          <GeneratorCard
            title="Choose Your Fate"
            description="A challenge awaits in the dark."
            icon={<Swords />}
            disabled={!environment || loadingState !== "idle"}
          >
            <HookForm form={objectiveForm} onSubmit={onObjectiveSubmit}>
              <FormField
                control={objectiveForm.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select Difficulty</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="easy" />
                          </FormControl>
                          <FormLabel className="font-normal">Easy</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medium" />
                          </FormControl>
                          <FormLabel className="font-normal">Medium</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="hard" />
                          </FormControl>
                          <FormLabel className="font-normal">Hard</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {loadingState === "objective" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Generate Objective"
                )}
              </Button>
            </HookForm>
          </GeneratorCard>
        </aside>

        <main className="md:col-span-3 flex flex-col gap-8">
          <Card className="flex-grow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen />
                The Story So Far
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingState === "environment" && (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              )}
              {environment ? (
                <p className="text-muted-foreground whitespace-pre-wrap font-serif text-lg leading-relaxed">
                  {environment}
                </p>
              ) : (
                <p className="text-muted-foreground italic">
                  The air is still. Your nightmare has not yet begun...
                </p>
              )}
            </CardContent>
          </Card>

          {(objective || loadingState === 'objective') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ghost /> Your Objective
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingState === 'objective' ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : objective ? (
                  <>
                    <p className="text-lg">{objective.objective}</p>
                    <div className="flex items-center gap-2 text-accent-foreground/80">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span>Reward: {objective.reward}</span>
                    </div>
                    <Button onClick={handleCompleteObjective} variant="destructive">
                      Complete Objective
                    </Button>
                  </>
                ) : null}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Skull /> Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold font-headline">{score}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Backpack /> Inventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                {inventory.length > 0 ? (
                  <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                    {inventory.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground italic">Your pockets are empty.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function GeneratorCard({
  icon,
  title,
  description,
  disabled = false,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card className={disabled ? "opacity-50 pointer-events-none" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon} {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function HookForm<T extends z.ZodType<any, any, any>>({
  form,
  onSubmit,
  children,
}: {
  form: UseFormReturn<z.infer<T>>;
  onSubmit: (values: z.infer<T>) => void;
  children: React.ReactNode;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {children}
      </form>
    </Form>
  );
}
