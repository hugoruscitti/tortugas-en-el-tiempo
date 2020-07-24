VERSION=$(shell git describe --tags)
NOMBRE="tortugas-en-el-tiempo"

N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m

comandos:
	@echo ""
	@echo "${B}Comandos disponibles para ${Y}${NOMBRE}${N} (versión: ${VERSION})"
	@echo ""
	@echo "  ${Y}Generales de la aplicación${N}"
	@echo ""
	@echo "    ${G}iniciar${N}                      Instala dependencias."
	@echo "    ${G}ejecutar${N}                     Ejecuta la aplicación en modo desarrollo."
	@echo ""

iniciar:
	$(call task, "Iniciando el proyecto.")
	$(call log, "Instalando dependencias.")
	@yarn install

ejecutar: 
	$(call log, "Ejecutando la aplicación en modo desarrollo.")
	@yarn serve

