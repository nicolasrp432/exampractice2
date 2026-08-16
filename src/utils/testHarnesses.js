// Test harnesses for funcion-type exercises.
// Each entry: { header, main }
//   header  — prepended BEFORE the user's code (e.g. typedefs the user doesn't write)
//   main    — appended AFTER the user's code (the main() that calls their function)
//
// Assembly: header + userCode + '\n' + main
// Program-type exercises (inter, wdmatch, fizzbuzz, etc.) don't need a harness.

export const testHarnesses = {

  // ── Level 1 ─────────────────────────────────────────────────────────────────

  ft_strlen: {
    header: '',
    main: `#include <stdio.h>
int main(int argc, char **argv)
{
\tif (argc < 2) { printf("0\\n"); return (0); }
\tprintf("%d\\n", ft_strlen(argv[1]));
\treturn (0);
}`,
  },

  ft_swap: {
    header: '',
    // Output after swap: "new_a new_b\n"
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tint a;
\tint b;
\tif (argc < 3) { printf("0 0\\n"); return (0); }
\ta = atoi(argv[1]);
\tb = atoi(argv[2]);
\tft_swap(&a, &b);
\tprintf("%d %d\\n", a, b);
\treturn (0);
}`,
  },

  ft_putstr: {
    header: '',
    // ft_putstr writes directly via write() — harness just calls it
    main: `int main(int argc, char **argv)
{
\tif (argc < 2) return (0);
\tft_putstr(argv[1]);
\treturn (0);
}`,
  },

  ft_strcpy: {
    header: '',
    main: `#include <stdio.h>
int main(int argc, char **argv)
{
\tchar dst[4096];
\tif (argc < 2) { printf("\\n"); return (0); }
\tft_strcpy(dst, argv[1]);
\tprintf("%s\\n", dst);
\treturn (0);
}`,
  },

  // ── Level 2 ─────────────────────────────────────────────────────────────────

  ft_atoi: {
    header: '',
    main: `#include <stdio.h>
int main(int argc, char **argv)
{
\tif (argc < 2) { printf("0\\n"); return (0); }
\tprintf("%d\\n", ft_atoi(argv[1]));
\treturn (0);
}`,
  },

  ft_strcmp: {
    header: '',
    main: `#include <stdio.h>
int main(int argc, char **argv)
{
\tif (argc < 3) { printf("0\\n"); return (0); }
\tprintf("%d\\n", ft_strcmp(argv[1], argv[2]));
\treturn (0);
}`,
  },

  ft_strcspn: {
    header: '',
    main: `#include <stdio.h>
int main(int argc, char **argv)
{
\tif (argc < 3) { printf("0\\n"); return (0); }
\tprintf("%d\\n", ft_strcspn(argv[1], argv[2]));
\treturn (0);
}`,
  },

  ft_strdup: {
    header: '',
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tchar *dup;
\tif (argc < 2) { printf("\\n"); return (0); }
\tdup = ft_strdup(argv[1]);
\tif (!dup) { printf("(null)\\n"); return (0); }
\tprintf("%s\\n", dup);
\tfree(dup);
\treturn (0);
}`,
  },

  ft_strpbrk: {
    header: '',
    // NULL case must print "(null)\n" to match test.salida
    main: `#include <stdio.h>
int main(int argc, char **argv)
{
\tchar *p;
\tif (argc < 3) { printf("(null)\\n"); return (0); }
\tp = ft_strpbrk(argv[1], argv[2]);
\tif (p)
\t\tprintf("%s\\n", p);
\telse
\t\tprintf("(null)\\n");
\treturn (0);
}`,
  },

  ft_strrev: {
    header: '',
    main: `#include <stdio.h>
int main(int argc, char **argv)
{
\tif (argc < 2) { printf("\\n"); return (0); }
\tprintf("%s\\n", ft_strrev(argv[1]));
\treturn (0);
}`,
  },

  is_power_of_2: {
    header: '',
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tunsigned int n;
\tif (argc < 2) { printf("0\\n"); return (0); }
\tn = (unsigned int)atoi(argv[1]);
\tprintf("%d\\n", is_power_of_2(n));
\treturn (0);
}`,
  },

  print_bits: {
    header: '',
    // print_bits writes bits via write() but NOT the trailing newline
    main: `#include <stdlib.h>
#include <unistd.h>
int main(int argc, char **argv)
{
\tunsigned char n;
\tif (argc < 2) return (0);
\tn = (unsigned char)atoi(argv[1]);
\tprint_bits(n);
\twrite(1, "\\n", 1);
\treturn (0);
}`,
  },

  reverse_bits: {
    header: '',
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tif (argc < 2) { printf("0\\n"); return (0); }
\tprintf("%d\\n", (int)reverse_bits((unsigned char)atoi(argv[1])));
\treturn (0);
}`,
  },

  swap_bits: {
    header: '',
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tif (argc < 2) { printf("0\\n"); return (0); }
\tprintf("%d\\n", (int)swap_bits((unsigned char)atoi(argv[1])));
\treturn (0);
}`,
  },

  // ── Level 3 ─────────────────────────────────────────────────────────────────

  pgcd: {
    header: '',
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tunsigned int a;
\tunsigned int b;
\tif (argc < 3) { printf("0\\n"); return (0); }
\ta = (unsigned int)atoi(argv[1]);
\tb = (unsigned int)atoi(argv[2]);
\tprintf("%u\\n", pgcd(a, b));
\treturn (0);
}`,
  },

  lcm: {
    header: '',
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tunsigned int a;
\tunsigned int b;
\tif (argc < 3) { printf("0\\n"); return (0); }
\ta = (unsigned int)atoi(argv[1]);
\tb = (unsigned int)atoi(argv[2]);
\tprintf("%u\\n", lcm(a, b));
\treturn (0);
}`,
  },

  ft_list_size: {
    // typedef must go BEFORE user's function (which uses t_list)
    header: `typedef struct s_list
{
\tstruct s_list\t*next;
\tvoid\t\t\t*data;
}\tt_list;\n\n`,
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tt_list\t*head;
\tt_list\t*tail;
\tt_list\t*node;
\tint\t\ti;

\thead = NULL;
\ttail = NULL;
\ti = 1;
\twhile (i < argc)
\t{
\t\tnode = malloc(sizeof(t_list));
\t\tnode->data = argv[i];
\t\tnode->next = NULL;
\t\tif (tail)
\t\t\ttail->next = node;
\t\telse
\t\t\thead = node;
\t\ttail = node;
\t\ti++;
\t}
\tprintf("%d\\n", ft_list_size(head));
\treturn (0);
}`,
  },

  ft_range: {
    header: '',
    // NULL (when min >= max) → print just "\n" to match salida='\n'
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tint\tmin;
\tint\tmax;
\tint\t*arr;
\tint\ti;

\tif (argc < 3) { printf("\\n"); return (0); }
\tmin = atoi(argv[1]);
\tmax = atoi(argv[2]);
\tif (min >= max) { printf("\\n"); return (0); }
\tarr = ft_range(min, max);
\tif (!arr) { printf("\\n"); return (0); }
\ti = 0;
\twhile (i < max - min)
\t{
\t\tprintf("%d\\n", arr[i]);
\t\ti++;
\t}
\tfree(arr);
\treturn (0);
}`,
  },

  ft_rrange: {
    header: '',
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tint\tmin;
\tint\tmax;
\tint\t*arr;
\tint\ti;

\tif (argc < 3) { printf("\\n"); return (0); }
\tmin = atoi(argv[1]);
\tmax = atoi(argv[2]);
\tif (min >= max) { printf("\\n"); return (0); }
\tarr = ft_rrange(min, max);
\tif (!arr) { printf("\\n"); return (0); }
\ti = 0;
\twhile (i < max - min)
\t{
\t\tprintf("%d\\n", arr[i]);
\t\ti++;
\t}
\tfree(arr);
\treturn (0);
}`,
  },

  ft_atoi_base: {
    header: '',
    main: `#include <stdio.h>
int main(int argc, char **argv)
{
\tif (argc < 3) { printf("0\\n"); return (0); }
\tprintf("%d\\n", ft_atoi_base(argv[1], argv[2]));
\treturn (0);
}`,
  },

  // ── Level 4 ─────────────────────────────────────────────────────────────────

  ft_split: {
    header: '',
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tchar\t**result;
\tint\t\ti;

\tif (argc < 3) return (0);
\tresult = ft_split(argv[1], argv[2][0]);
\tif (!result) return (0);
\ti = 0;
\twhile (result[i])
\t{
\t\tprintf("%s\\n", result[i]);
\t\tfree(result[i]);
\t\ti++;
\t}
\tfree(result);
\treturn (0);
}`,
  },

  sort_list: {
    header: `typedef struct s_list
{
\tstruct s_list\t*next;
\tvoid\t\t\t*data;
}\tt_list;\n\n`,
    main: `#include <stdio.h>
#include <stdlib.h>

static int\tcmp_ints(void *a, void *b)
{
\treturn (*(int *)a - *(int *)b);
}

int main(int argc, char **argv)
{
\tt_list\t*head;
\tt_list\t*tail;
\tt_list\t*node;
\tt_list\t*cur;
\tint\t\t*val;
\tint\t\ti;

\thead = NULL;
\ttail = NULL;
\ti = 1;
\twhile (i < argc)
\t{
\t\tnode = malloc(sizeof(t_list));
\t\tval = malloc(sizeof(int));
\t\t*val = atoi(argv[i]);
\t\tnode->data = val;
\t\tnode->next = NULL;
\t\tif (tail)
\t\t\ttail->next = node;
\t\telse
\t\t\thead = node;
\t\ttail = node;
\t\ti++;
\t}
\thead = sort_list(head, cmp_ints);
\tcur = head;
\twhile (cur)
\t{
\t\tprintf("%d\\n", *(int *)cur->data);
\t\tcur = cur->next;
\t}
\treturn (0);
}`,
  },

  max: {
    header: '',
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tint tab[1024];
\tunsigned int len;
\tint i;

\tif (argc < 2) { printf("0\\n"); return (0); }
\tlen = 0;
\ti = 1;
\twhile (i < argc)
\t\ttab[len++] = atoi(argv[i++]);
\tprintf("%d\\n", max(tab, len));
\treturn (0);
}`,
  },

  ft_itoa: {
    header: '',
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tchar *s;
\tint n;

\tn = (argc < 2) ? 0 : atoi(argv[1]);
\ts = ft_itoa(n);
\tif (!s) { printf("(null)\\n"); return (0); }
\tprintf("%s\\n", s);
\tfree(s);
\treturn (0);
}`,
  },

  sort_int_tab: {
    header: '',
    main: `#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv)
{
\tint tab[1024];
\tunsigned int size;
\tint i;

\tsize = 0;
\ti = 1;
\twhile (i < argc)
\t\ttab[size++] = atoi(argv[i++]);
\tsort_int_tab(tab, size);
\tif (size == 0) { printf("\\n"); return (0); }
\ti = 0;
\twhile (i < (int)size)
\t\tprintf("%d\\n", tab[i++]);
\treturn (0);
}`,
  },

  ft_list_foreach: {
    header: `typedef struct s_list
{
\tstruct s_list\t*next;
\tvoid\t\t\t*data;
}\tt_list;\n\n`,
    main: `#include <stdio.h>
#include <stdlib.h>

static void inc_int(void *data)
{
\t(*(int *)data)++;
}

int main(int argc, char **argv)
{
\tt_list *head;
\tt_list *tail;
\tt_list *node;
\tint *value;
\tint i;

\thead = NULL;
\ttail = NULL;
\ti = 1;
\twhile (i < argc)
\t{
\t\tnode = malloc(sizeof(t_list));
\t\tvalue = malloc(sizeof(int));
\t\t*value = atoi(argv[i++]);
\t\tnode->data = value;
\t\tnode->next = NULL;
\t\tif (tail)
\t\t\ttail->next = node;
\t\telse
\t\t\thead = node;
\t\ttail = node;
\t}
\tif (!head)
\t{
\t\tprintf("\\n");
\t\treturn (0);
\t}
\tft_list_foreach(head, inc_int);
\twhile (head)
\t{
\t\tnode = head;
\t\tprintf("%d\\n", *(int *)node->data);
\t\thead = head->next;
\t\tfree(node->data);
\t\tfree(node);
\t}
\treturn (0);
}`,
  },

  ft_list_remove_if: {
    header: `typedef struct s_list
{
\tstruct s_list\t*next;
\tvoid\t\t\t*data;
}\tt_list;\n\n`,
    main: `#include <stdio.h>
#include <stdlib.h>

static int cmp_int(void *a, void *b)
{
\treturn (*(int *)a - *(int *)b);
}

static void push_back(t_list **head, t_list **tail, int value)
{
\tt_list *node;
\tint *data;

\tnode = malloc(sizeof(t_list));
\tdata = malloc(sizeof(int));
\t*data = value;
\tnode->data = data;
\tnode->next = NULL;
\tif (*tail)
\t\t(*tail)->next = node;
\telse
\t\t*head = node;
\t*tail = node;
}

int main(int argc, char **argv)
{
\tt_list *head;
\tt_list *tail;
\tt_list *cur;
\tint ref;
\tint i;

\tif (argc < 2) return (0);
\thead = NULL;
\ttail = NULL;
\tref = atoi(argv[1]);
\ti = 2;
\twhile (i < argc)
\t\tpush_back(&head, &tail, atoi(argv[i++]));
\tft_list_remove_if(&head, &ref, cmp_int);
\tif (!head)
\t{
\t\tprintf("\\n");
\t\treturn (0);
\t}
\tcur = head;
\twhile (cur)
\t{
\t\tprintf("%d\\n", *(int *)cur->data);
\t\tcur = cur->next;
\t}
\twhile (head)
\t{
\t\tcur = head;
\t\thead = head->next;
\t\tfree(cur->data);
\t\tfree(cur);
\t}
\treturn (0);
}`,
  },

  flood_fill: {
    header: `typedef struct  s_point
{
\tint x;
\tint y;
}\tt_point;\n\n`,
    main: `#include <stdio.h>
#include <stdlib.h>

static char **make_area(t_point size, char **zone)
{
\tchar **new;
\tint i;
\tint j;

\tnew = malloc(sizeof(char *) * size.y);
\ti = 0;
\twhile (i < size.y)
\t{
\t\tnew[i] = malloc(size.x + 1);
\t\tj = 0;
\t\twhile (j < size.x)
\t\t{
\t\t\tnew[i][j] = zone[i][j];
\t\t\tj++;
\t\t}
\t\tnew[i][size.x] = '\\0';
\t\ti++;
\t}
\treturn (new);
}

static void print_area(t_point size, char **area)
{
\tint i;

\ti = 0;
\twhile (i < size.y)
\t{
\t\tprintf("%s\\n", area[i]);
\t\ti++;
\t}
}

static void free_area(t_point size, char **area)
{
\tint i;

\ti = 0;
\twhile (i < size.y)
\t\tfree(area[i++]);
\tfree(area);
}

int main(int argc, char **argv)
{
\tt_point size = {8, 5};
\tt_point begin = {7, 4};
\tchar *zone[] = {
\t\t"11111111",
\t\t"10001001",
\t\t"10010001",
\t\t"10110001",
\t\t"11100001",
\t};
\tchar **area;
\t(void)argc;
\t(void)argv;
\tarea = make_area(size, zone);
\tprint_area(size, area);
\tprintf("\\n");
\tflood_fill(area, size, begin);
\tprint_area(size, area);
\tfree_area(size, area);
\treturn (0);
}`,
  },
}

// Build the full C code to send to Piston.
// For funcion-type: header + userCode + '\n' + main
// For programa-type (no harness): just userCode
export function buildFullCode(exerciseId, tipoEntrega, userCode) {
  if (tipoEntrega !== 'funcion') return userCode
  const h = testHarnesses[exerciseId]
  if (!h) return userCode
  return h.header + userCode + '\n' + h.main
}
// AUTOGEN — pegar al final de src/utils/testHarnesses.js
// Generated by scripts/inject-real-mains.mjs
//
// Mains reales del repo rank02. Disponibles para los harnesses de
// tipoEntrega="funcion" cuando se quiere ejecutar EXACTAMENTE el
// main de referencia en vez del de la plataforma.
//
// Algunos mains no compilan con -Wall -Wextra -Werror (warnings reales
// en el código del repo). Se marcan con requiereWarningsRelajados:true
// para que el llamador pase -w al compilador.

export const realMains = {
  ft_putstr: {
    requiereWarningsRelajados: false,
    main: `void    ft_putstr(char *str);
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char **argv)
{
    if(argc == 1)
    {
        printf("ft_putstr(\\"\\")\\n");
        return(0);
    }
    printf("ft_putstr(\\"%s\\")\\n", argv[1]);
    ft_putstr(argv[1]);
    printf("\\n");
    return(0);
}`,
  },
  ft_strcpy: {
    requiereWarningsRelajados: false,
    main: `char	*ft_strcpy(char *s1, char *s2);
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char **argv)
{
    (void)argc;
    char *str = malloc(sizeof(char) * 100);
    printf("ft_strcpy(\\"%s\\", str) = %s\\n", argv[1], ft_strcpy(str, argv[1]));
    free(str);
    return(0);
}`,
  },
  ft_strlen: {
    requiereWarningsRelajados: false,
    main: `
int     ft_strlen(char *str);
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char **argv)
{
    if(argc == 1)
    {
        printf("ft_strlen(\\"\\") = %d\\n", ft_strlen(""));
        return(0);
    }
    printf("ft_strlen(\\"%s\\") = %d\\n", argv[1], ft_strlen(argv[1]));
    return(0);
}`,
  },
  ft_swap: {
    requiereWarningsRelajados: true,
    main: `#include <unistd.h>
#include <stdio.h>
void    ft_swap(int *a, int *b);


int	main(void)
{
	int	*a;
	int	*b;
	int	n1;
	int	n2;

	n1 = 9;
	n2 = 6;
	a = &n1;
	b = &n2;
	printf("Value of n1 is: %u and the value of n2 is: %u.", *a, *b);
	ft_swap(a, b);
	printf("\\n");
	printf("Now the value of n1 is: %u and the value of n2 is: %u.", *a, *b);
	printf("\\n");
}`,
  },
  ft_atoi: {
    requiereWarningsRelajados: false,
    main: `
int	ft_atoi(const char *str);
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char **argv)
{
    (void)argc;
    printf("ft_atoi(\\"%s\\") = %d\\n", argv[1], ft_atoi(argv[1]));
    return(0);
}`,
  },
  ft_strcmp: {
    requiereWarningsRelajados: false,
    main: `
int    ft_strcmp(char *s1, char *s2);
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char **argv)
{
    if (argc == 3)
        printf("ft_strcmp(\\"%s\\", \\"%s\\") = %d\\n", argv[1], argv[2], ft_strcmp(argv[1], argv[2]));
    return(0);
}`,
  },
  ft_strcspn: {
    requiereWarningsRelajados: false,
    main: `
#include <stdio.h>
size_t	ft_strcspn(const char *s, const char *reject);

int main(int argc, char **argv)
{
    if (argc == 3)
        printf("ft_strcspn(\\"%s\\", \\"%s\\") = %zu\\n", argv[1], argv[2], ft_strcspn(argv[1], argv[2]));
    return(0);
}`,
  },
  ft_strdup: {
    requiereWarningsRelajados: false,
    main: `
char    *ft_strdup(char *src);
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char **argv)
{
    if(argc == 1)
    {
        printf("ft_strdup(\\"\\") = %s\\n", ft_strdup(""));
        return(0);
    }
    printf("ft_strdup(\\"%s\\") = %s\\n", argv[1], ft_strdup(argv[1]));
    return(0);
}`,
  },
  ft_strrev: {
    requiereWarningsRelajados: false,
    main: `#include <stdio.h>

char *ft_strrev(char *str);

int main(int argc, char **argv)
{
    if (argc == 2)
        printf("%s", ft_strrev(argv[1]));
    return (0);
}`,
  },
  is_power_of_2: {
    requiereWarningsRelajados: false,
    main: `
int	    is_power_of_2(unsigned int n);
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char **argv)
{
    if(argc == 1)
        return(0);
    printf("is_power_of_2(\\"%s\\") = %d\\n", argv[1], is_power_of_2(atoi(argv[1])));
    return(0);
}`,
  },
  max: {
    requiereWarningsRelajados: false,
    main: `
int		max(int* tab, unsigned int len);
#include <stdlib.h>
#include <stdio.h>

int main(int argc, char **argv)
{
    if (argc < 3)
        return(0);
    int *tab = malloc(sizeof(int) * (argc - 1));
    
    printf("max( {");
    for (int i = 2; i < argc; i++)
    {
        printf("%s", argv[i]);
        if (i != argc - 1)
            printf(";");
        tab[i - 2] = atoi(argv[i]);
    }
    printf("} , %s) = %d\\n", argv[1], max(tab, atoi(argv[1])));
    // printf("max(\\"%s\\") = %d\\n", argv[1], is_power_of_2(atoi(argv[1])));
    return(0);
}`,
  },
  print_bits: {
    requiereWarningsRelajados: false,
    main: `#include <unistd.h>
void print_bits(unsigned char octet);

int main(int ac, char **av)
{
    if (ac == 2)
        print_bits(av[1][0]);
    write(1, "\\n", 1);
    return (0);
}`,
  },
  reverse_bits: {
    requiereWarningsRelajados: false,
    main: `#include <stdio.h>

unsigned char	reverse_bits(unsigned char octet);

int main(int ac, char **av)
{
    if (ac == 2)
        printf("%d", reverse_bits(av[1][0]));
    return (0);
}`,
  },
  swap_bits: {
    requiereWarningsRelajados: false,
    main: `#include <unistd.h>

unsigned char	swap_bits(unsigned char octet);

int	main(int argc, char **argv)
{
	unsigned char c;
	(void)argc;

	c = argv[1][0];
	write(1, &c, 1);
	write(1, "\\n", 1);
	c = swap_bits(c);
	write(1, &c, 1);
	write(1, "\\n", 1);
	return (0);
}`,
  },
  ft_atoi_base: {
    requiereWarningsRelajados: false,
    main: `/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jcluzet <jcluzet@student.42.fr>            +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/05/21 02:22:36 by jcluzet           #+#    #+#             */
/*   Updated: 2022/05/21 02:23:23 by jcluzet          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>
#include <stdlib.h>
int		ft_atoi_base(const char *str, int str_base);

int main(int argc, char **argv)
{
    if (argc == 3)
    {
        printf("%d\\n", ft_atoi_base(argv[1], atoi(argv[2])));
    }
    return (0);
}`,
  },
  ft_list_size: {
    requiereWarningsRelajados: false,
    main: `#include <stdio.h>
#include <stdlib.h>

typedef struct s_list
{
    struct s_list *next;
    void          *data;
} t_list;


int	ft_list_size(t_list *begin_list);


int	main(void)
{
	int n = 0;

	t_list *c = malloc(sizeof(*c));
	c->next = 0;
	c->data = &n;

	t_list *b = malloc(sizeof(*b));
	b->next = c;
	b->data = &n;

	t_list *a = malloc(sizeof(*a));
	a->next = b;
	a->data = &n;

	printf("%d\\n", ft_list_size(a));
}`,
  },
  ft_range: {
    requiereWarningsRelajados: false,
    main: `#include <stdio.h>
#include <stdlib.h>

int *ft_range(int start, int end);

int main(int argc, char **argv)
{
	(void)argc;
	int	arr_len;
	int	*arr;

	arr_len = abs(atoi(argv[2]) - atoi(argv[1]));
	arr = ft_range(atoi(argv[1]), atoi(argv[2]));
	for (int i = 0; i <= arr_len; i += 1)
		printf("%d\\n", arr[i]);
	free(arr);
	return (EXIT_SUCCESS);
}`,
  },
  ft_rrange: {
    requiereWarningsRelajados: false,
    main: `#include <stdio.h>
#include <stdlib.h>

int		*ft_rrange(int start, int end);
int		absolute_value(int n)
{
	if (n < 0)
		return (-n);
	return (n);
}

int		main(int argc, char **argv)
{
	(void)argc;
	int start = atoi(argv[1]);
	int end = atoi(argv[2]);

	int *arr = ft_rrange(start, end);

	int i = 0;
	while (i < 1 + absolute_value(end - start))
	{
		printf("%d", arr[i]);
        if (i < 1 + absolute_value(end - start) - 1)
            printf(", ");
		++i;
	}
	printf("\\n");
}`,
  },
  lcm: {
    requiereWarningsRelajados: false,
    main: `#include <stdio.h>
#include <stdlib.h>

unsigned int lcm(unsigned int a, unsigned int b);

int main(int ac, char **av){
	if (ac == 3)
		printf("%d", lcm(atoi(av[1]), atoi(av[2])));
	return (0);
}`,
  },
  flood_fill: {
    requiereWarningsRelajados: false,
    main: `/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pandalaf <pandalaf@student.42wolfsburg.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/06 23:17:55 by pandalaf          #+#    #+#             */
/*   Updated: 2022/11/06 23:19:55 by pandalaf         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>
#include <stdio.h>

typedef struct 	s_point {
    int 		x;				// x : Width  | x-axis
    int 		y;				// y : Height | y-axis
} 				t_point;

void	flood_fill(char **tab, t_point size, t_point begin);

char** make_area(char** zone, t_point size)
{
	char** new;

	new = malloc(sizeof(char*) * size.y);
	for (int i = 0; i < size.y; ++i)
	{
		new[i] = malloc(size.x + 1);
		for (int j = 0; j < size.x; ++j)
			new[i][j] = zone[i][j];
		new[i][size.x] = '\\0';
	}

	return new;
}

int	main(void)
{
	t_point size = {8, 5};
	char *zone1[] = {
		"11111111",
		"10000001",
		"10010101",
		"10110001",
		"11101111",
	};
	char *zone2[] = {
		"11111111",
		"10011001",
		"10100101",
		"11000011",
		"11111111",
	};

	// Make area arrays
	char**  area1 = make_area(zone1, size);
	char**  area2 = make_area(zone1, size);
	char**  area3 = make_area(zone2, size);
	// Present map 1
	printf("Map 1\\n");
	for (int i = 0; i < size.y; ++i)
		printf("%s\\n", area1[i]);
	printf("\\n");
	// Assign starting points
	t_point begin1 = {7, 4};
	t_point begin2 = {3, 1};
	t_point begin3 = {0, 0};
	// Perform first two operations
	flood_fill(area1, size, begin1);
	flood_fill(area2, size, begin2);
	printf("Start (7, 4)\\n");
	for (int i = 0; i < size.y; ++i)
		printf("%s\\n", area1[i]);
	printf("\\n");
	printf("Start (3, 1)\\n");
	for (int i = 0; i < size.y; ++i)
		printf("%s\\n", area2[i]);
	printf("\\n-----------\\n");
	// Present map 2
	printf("Map 2\\n");
	for (int i = 0; i < size.y; ++i)
		printf("%s\\n", area3[i]);
	printf("\\n");
	// Perform third operation
	flood_fill(area3, size, begin3);
	printf("Start (0, 0)\\n");
	for (int i = 0; i < size.y; ++i)
		printf("%s\\n", area3[i]);
	return (0);
}`,
  },
  ft_itoa: {
    requiereWarningsRelajados: false,
    main: `/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: jmehmy <jmehmy@student.42lisboa.com>       +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/05/21 02:22:36 by jcluzet           #+#    #+#             */
/*   Updated: 2025/05/22 19:03:09 by jmehmy           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdio.h>
#include <stdlib.h>
char	*ft_itoa(int nbr);

int main(int argc, char **argv)
{
   (void)argc;
    printf("%s\\n", ft_itoa(atoi(argv[1])));
    return (0);
}`,
  },
  ft_list_foreach: {
    requiereWarningsRelajados: false,
    main: `#include <stdlib.h>
#include <stdio.h>
#include "ft_list.h"

void ft_putnbr(void *data)
{
	int *i;

	i = data;
	printf("%d", *i);
}

void ft_list_push_front(t_list **begin_list, void *data)
{
	t_list *new;

	new = malloc(sizeof(t_list));
	new->data = data;
	new->next = *begin_list;
	*begin_list = new;
}



int main()
{
	t_list *list;
	int i;
	int *data;

	i = 0;
	list = NULL;
	while (i < 10)
	{
		data = malloc(sizeof(int));
		*data = i;
		ft_list_push_front(&list, data);
		i++;
	}
	ft_list_foreach(list, &ft_putnbr);
	return (0);
}`,
  },
  ft_list_remove_if: {
    requiereWarningsRelajados: false,
    main: `#include <stdio.h>
#include <string.h>
#include "ft_list.h"
#include <stdlib.h>

void	print_list(t_list **begin_list)
{
	t_list *cur = *begin_list;
	while (cur != 0)
	{
		printf("%s\\n", (char *)cur->data);
		cur = cur->next;
	}
}

int		main(void)
{
	char straa[] = "String aa";
	t_list *aa = malloc(sizeof(t_list));
	aa->next = 0;
	aa->data = straa;

	char strbb[] = "String bb";
	t_list *bb = malloc(sizeof(t_list));
	bb->next = 0;
	bb->data = strbb;

	char strcc[] = "String cc";
	t_list *cc = malloc(sizeof(t_list));
	cc->next = 0;
	cc->data = strcc;

	char strdd[] = "String dd";
	t_list *dd = malloc(sizeof(t_list));
	dd->next = 0;
	dd->data = strdd;

	aa->next = bb;
	bb->next = cc;
	cc->next = dd;

	t_list **begin_list = &aa;

	print_list(begin_list);
	printf("----------\\n");
	ft_list_remove_if(begin_list, straa, strcmp);
	print_list(begin_list);
}`,
  },
  ft_split: {
    requiereWarningsRelajados: false,
    main: `/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: pandalaf <pandalaf@student.42wolfsburg.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/06 15:58:50 by pandalaf          #+#    #+#             */
/*   Updated: 2022/11/06 15:59:01 by pandalaf         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <stdlib.h>
#include <stdio.h>

char	**ft_split(char *str);

int main(int argc, char **argv)
{
	char	**split;
	int		i;

	if (argc == 2)
	{
		split = ft_split(argv[1]);
			printf("%s ", split[0]);
		i = 1;
		while (split[i] != 0)
		{
			printf("%s ", split[i]);
			i++;
		}
		printf("%s", split[i]);
	}
	printf("\\n");
    return (0);
}`,
  },
  sort_int_tab: {
    requiereWarningsRelajados: false,
    main: `#include <stdio.h>

void	sort_int_tab(int *tab, unsigned int size);

int main(){
	int tab[5] = {5, 4, 3, 2, 1};
	sort_int_tab(tab, 5);
	for (int i = 0; i < 5; i++)
		printf("%d ", tab[i]);
	return 0;
}`,
  },
  sort_list: {
    requiereWarningsRelajados: false,
    main: `#include "ft_list.h"


int		croissant(int a, int b) // cmp fonksiyonnu
{
	if (a <= b) //1 < 2 = 1
		return (1);
	else // 2 > 1 = 0
		return (0);
}

int main(void)
{
	t_list *lst;
	
	lst = (t_list*)malloc(sizeof(t_list));
	lst->data = 20;
	lst->next = (t_list*)malloc(sizeof(t_list));
	lst->next->data = 10;
	lst->next->next = (t_list*)malloc(sizeof(t_list));
	lst->next->next->data = 0;
	lst->next->next->next = NULL;

	lst = sort_list(lst, croissant);

	while (lst != NULL)
	{
		printf("%d\\n", lst->data);
	    lst = lst->next;
	}

	return (0);
}`,
  },
}

/**
 * Variante de buildFullCode que permite usar el main real del rank02.
 * Devuelve { code, requiereWarningsRelajados } para que el caller
 * pueda ajustar las flags de gcc.
 */
export function buildFullCodeWithRealMain(exerciseId, tipoEntrega, userCode) {
  if (tipoEntrega !== "funcion") {
    return { code: userCode, requiereWarningsRelajados: false }
  }
  const m = realMains[exerciseId]
  const h = testHarnesses[exerciseId]
  if (!m) {
    // sin main real disponible — caemos al harness normal
    const fallback = h ? h.header + userCode + "\n" + h.main : userCode
    return { code: fallback, requiereWarningsRelajados: false }
  }
  const header = h ? h.header : ""
  return {
    code: header + userCode + "\n" + m.main,
    requiereWarningsRelajados: m.requiereWarningsRelajados,
  }
}
