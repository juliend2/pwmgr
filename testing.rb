require "highline/import"

puts "Using: #{HighLine.default_instance.terminal.class}"
puts

pass = ask("Enter your password:  ") { |q| q.echo = "x" }
puts "Your password is #{pass}!"

# require 'aescrypt'
# encrypted = File.open('./data/poulet.dat').read
# puts encrypted
# puts AESCrypt.decrypt(encrypted, pass)