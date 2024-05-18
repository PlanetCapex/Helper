import ast
import inspect
from typing import List, Set
import importlib




def get_raised_exceptions_recursive(func) -> Set[str]:
    """
    Extracts the exceptions raised by a function and any function it calls
    """
    exceptions = set()
    visited = set()

    def visit_node(node):
        if isinstance(node, ast.Raise):
            if node.exc and isinstance(node.exc, ast.Call):
                exceptions.add(node.exc.func.id)
            elif node.exc:
                exceptions.add(getattr(node.exc, 'id', 'UnknownException'))
        elif isinstance(node, ast.Call):
            called_func_name = getattr(node.func, 'id', None)
            if called_func_name and called_func_name not in visited:
                try:
                    visited.add(called_func_name)
                    called_func = getattr(func.__globals__[called_func_name], '__call__', None)

                    if callable(called_func):
                        inner_source = inspect.getsource(called_func)
                        inner_tree = ast.parse(inner_source)
                        for inner_node in ast.walk(inner_tree):
                            visit_node(inner_node)
                except (KeyError, TypeError, OSError):
                    pass  # The function is not in this module or source not available.

    try:
        source = inspect.getsource(func)
        tree = ast.parse(source)

        for node in ast.walk(tree):
            visit_node(node)

    except (TypeError, OSError):
        pass  # Cannot get source or parse the AST

    return exceptions


def get_imported_modules(func: callable) -> List[Exception]:
    """
    Extracts the imported modules from a list of exception strings
    """
    imported_modules = set()
    exception_strings = get_raised_exceptions_recursive(func)
    module = importlib.import_module(func.__module__)
    for exception in exception_strings:
        try:
            imported_modules.add(getattr(module, exception))
        except AttributeError:
            pass
    return list(imported_modules)


exception_imports = get_imported_modules(get_todo_item)
print(exception_imports)
